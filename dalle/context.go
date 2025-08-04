package dalle

import (
	"fmt"
	"path/filepath"
	"strings"
	"sync"
	"text/template"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
)

// Context holds templates, series, dbs, and cache for prompt generation.
type Context struct {
	Series         Series
	Databases      map[string][]string
	DalleCache     map[string]*DalleDress
	CacheMutex     sync.Mutex
	OutputPath     string
	promptTemplate *template.Template
	dataTemplate   *template.Template
	titleTemplate  *template.Template
	terseTemplate  *template.Template
	authorTemplate *template.Template
}

func NewContext(outputPath string) *Context {
	ctx := Context{
		promptTemplate: promptTemplate,
		dataTemplate:   dataTemplate,
		titleTemplate:  titleTemplate,
		terseTemplate:  terseTemplate,
		authorTemplate: authorTemplate,
		Series:         Series{},
		Databases:      make(map[string][]string),
		DalleCache:     make(map[string]*DalleDress),
		OutputPath:     outputPath,
	}
	ctx.ReloadDatabases()
	return &ctx
}

var saveMutex sync.Mutex

// reportOn logs and saves generated prompt data for a given address and location.
func (ctx *Context) reportOn(dd *DalleDress, addr, loc, ft, value string) {
	logger.Info("Generating", loc, "for "+addr)
	path := filepath.Join(ctx.OutputPath, strings.ToLower(loc))

	saveMutex.Lock()
	defer saveMutex.Unlock()
	_ = file.EstablishFolder(path)
	_ = file.StringToAsciiFile(filepath.Join(path, dd.Filename+"."+ft), value)
}

// MakeDalleDress builds or retrieves a DalleDress for the given address using the context's templates, series, dbs, and cache.
func (ctx *Context) MakeDalleDress(addressIn string) (*DalleDress, error) {
	ctx.CacheMutex.Lock()
	defer ctx.CacheMutex.Unlock()
	if ctx.DalleCache[addressIn] != nil {
		logger.Info("Returning cached dalle for", addressIn)
		return ctx.DalleCache[addressIn], nil
	}

	address := addressIn
	logger.Info("Making dalle for", addressIn)
	// ENS resolution should be handled outside, but you can add it here if needed

	parts := strings.Split(address, ",")
	seed := parts[0] + reverse(parts[0])
	if len(seed) < 66 {
		return nil, fmt.Errorf("seed length is less than 66")
	}
	if strings.HasPrefix(seed, "0x") {
		seed = seed[2:66]
	}

	fn := validFilename(address)
	if ctx.DalleCache[fn] != nil {
		logger.Info("Returning cached dalle for", addressIn)
		return ctx.DalleCache[fn], nil
	}

	dd := DalleDress{
		Original:  addressIn,
		Filename:  fn,
		Seed:      seed,
		AttribMap: make(map[string]Attribute),
	}

	cnt := 0
	for i := 0; i < len(dd.Seed); i = i + 8 {
		attr := NewAttribute(ctx.Databases, cnt, dd.Seed[i:i+6])
		dd.Attribs = append(dd.Attribs, attr)
		dd.AttribMap[attr.Name] = attr
		cnt++
		if i+4+6 < len(dd.Seed) {
			attr = NewAttribute(ctx.Databases, cnt, dd.Seed[i+4:i+4+6])
			dd.Attribs = append(dd.Attribs, attr)
			dd.AttribMap[attr.Name] = attr
			cnt++
		}
	}

	suff := ctx.Series.Suffix
	dd.DataPrompt, _ = dd.ExecuteTemplate(ctx.dataTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "data"), "txt", dd.DataPrompt)
	dd.TitlePrompt, _ = dd.ExecuteTemplate(ctx.titleTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "title"), "txt", dd.TitlePrompt)
	dd.TersePrompt, _ = dd.ExecuteTemplate(ctx.terseTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "terse"), "txt", dd.TersePrompt)
	dd.Prompt, _ = dd.ExecuteTemplate(ctx.promptTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "prompt"), "txt", dd.Prompt)
	fnPath := filepath.Join(ctx.OutputPath, ctx.Series.Suffix, "enhanced", dd.Filename+".txt")
	dd.EnhancedPrompt = ""
	if file.FileExists(fnPath) {
		dd.EnhancedPrompt = file.AsciiFileToString(fnPath)
	}

	ctx.DalleCache[dd.Filename] = &dd
	ctx.DalleCache[addressIn] = &dd

	return &dd, nil
}

// GetPrompt returns the generated prompt for the given address.
func (ctx *Context) GetPrompt(addr string) string {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error()
	} else {
		return dd.Prompt
	}
}

// GetEnhanced returns the enhanced prompt for the given address.
func (ctx *Context) GetEnhanced(addr string) string {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error()
	} else {
		return dd.EnhancedPrompt
	}
}

// Save generates and saves prompt data for the given address.
func (ctx *Context) Save(addr string) bool {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return false
	} else {
		ctx.reportOn(dd, addr, filepath.Join(ctx.Series.Suffix, "selector"), "json", dd.String())
		return true
	}
}

// GenerateEnhanced generates an enhanced prompt for the given address.
func (ctx *Context) GenerateEnhanced(addr string) string {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error()
	} else {
		authorType, _ := dd.ExecuteTemplate(ctx.authorTemplate, nil)
		if dd.EnhancedPrompt, err = EnhancePrompt(ctx.GetPrompt(addr), authorType); err != nil {
			logger.Fatal(err.Error())
		}
		msg := " DO NOT PUT TEXT IN THE IMAGE. "
		dd.EnhancedPrompt = msg + dd.EnhancedPrompt + msg
		return dd.EnhancedPrompt
	}
}

// GenerateImage generates an image for the given address.
func (ctx *Context) GenerateImage(addr string) (string, error) {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error(), err
	} else {
		suff := ctx.Series.Suffix
		dd.EnhancedPrompt = ctx.GenerateEnhanced(addr)
		ctx.reportOn(dd, addr, filepath.Join(suff, "enhanced"), "txt", dd.EnhancedPrompt)
		_ = ctx.Save(addr)
		imageData := ImageData{
			TitlePrompt:    dd.TitlePrompt,
			TersePrompt:    dd.TersePrompt,
			EnhancedPrompt: dd.EnhancedPrompt,
			SeriesName:     ctx.Series.Suffix,
			Filename:       dd.Filename,
		}
		outputPath := filepath.Join(ctx.OutputPath, imageData.SeriesName, "generated")
		if err := RequestImage(outputPath, &imageData); err != nil {
			return err.Error(), err
		}
		return dd.EnhancedPrompt, nil
	}
}
