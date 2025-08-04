package dalle

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/colors"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
)

type ImageData struct {
	EnhancedPrompt string `json:"enhancedPrompt"`
	TersePrompt    string `json:"tersePrompt"`
	TitlePrompt    string `json:"titlePrompt"`
	SeriesName     string `json:"seriesName"`
	Filename       string `json:"filename"`
}

func RequestImage(outputPath string, imageData *ImageData) error {
	generated := outputPath
	_ = file.EstablishFolder(generated)
	annotated := strings.Replace(generated, "/generated", "/annotated", -1)
	_ = file.EstablishFolder(annotated)

	fn := filepath.Join(generated, fmt.Sprintf("%s.png", imageData.Filename))
	logger.Info(colors.Cyan, imageData.Filename, colors.Yellow, "- improving the prompt...", colors.Off)

	size := "1024x1024"
	if strings.Contains(imageData.EnhancedPrompt, "horizontal") {
		size = "1792x1024"
	} else if strings.Contains(imageData.EnhancedPrompt, "vertical") {
		size = "1024x1792"
	}

	quality := "standard"
	if os.Getenv("DALLE_QUALITY") != "" {
		quality = os.Getenv("DALLE_QUALITY")
	}

	url := openaiAPIURL
	payload := dalleRequest{
		Prompt:  imageData.EnhancedPrompt,
		N:       1,
		Quality: quality,
		Style:   "vivid",
		Model:   "dall-e-3",
		Size:    size,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	logger.Info(colors.Cyan, imageData.Filename, colors.Yellow, "- generating the image...", colors.Off)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	bodyStr := string(body)
	body = []byte(bodyStr)

	var dalleResp dalleResponse1
	err = json.Unmarshal(body, &dalleResp)
	if err != nil {
		return err
	}

	if resp.StatusCode != 200 {
		return fmt.Errorf("error: %s %d %s", resp.Status, resp.StatusCode, string(body))
	}

	if len(dalleResp.Data) == 0 {
		return fmt.Errorf("no images returned")
	}

	imageURL := dalleResp.Data[0].Url

	imageResp, err := httpGet(imageURL)
	if err != nil {
		return err
	}
	defer imageResp.Body.Close()

	os.Remove(fn)
	file, err := openFile(fn, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		return fmt.Errorf("failed to open output file: %s", fn)
	}
	defer file.Close()

	_, err = ioCopy(file, imageResp.Body)
	if err != nil {
		return err
	}

	path, err := annotateFunc(imageData.TersePrompt, fn, "bottom", 0.2)
	if err != nil {
		return fmt.Errorf("error annotating image: %v", err)
	}
	logger.Info(colors.Cyan, imageData.Filename, colors.Green, "- image saved as", colors.White+strings.Trim(path, " "), colors.Off)
	if os.Getenv("TB_CMD_LINE") == "true" {
		utils.System("open " + path)
	}
	return nil
}
