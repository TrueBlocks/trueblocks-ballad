package dalle

// var dalleCacheMutex sync.Mutex

// func (a *App) MakeDalleDress(addressIn string) (*dalle.DalleDress, error) {
// 	dalleCacheMutex.Lock()
// 	defer dalleCacheMutex.Unlock()
// 	if a.dalleCache[addressIn] != nil {
// 		logger.Info("Returning cached dalle for", addressIn)
// 		return a.dalleCache[addressIn], nil
// 	}

// 	address := addressIn
// 	logger.Info("Making dalle for", addressIn)
// 	if strings.HasSuffix(address, ".eth") {
// 		opts := sdk.NamesOptions{
// 			Terms: []string{address},
// 		}
// 		if names, _, err := opts.Names(); err != nil {
// 			return nil, fmt.Errorf("error getting names for %s", address)
// 		} else {
// 			if len(names) > 0 {
// 				address = names[0].Address.Hex()
// 			}
// 		}
// 	}
// 	logger.Info("Resolved", addressIn)

// 	parts := strings.Split(address, ",")
// 	seed := parts[0] + reverse(parts[0])
// 	if len(seed) < 66 {
// 		return nil, fmt.Errorf("seed length is less than 66")
// 	}
// 	if strings.HasPrefix(seed, "0x") {
// 		seed = seed[2:66]
// 	}

// 	fn := validFilename(address)
// 	if a.dalleCache[fn] != nil {
// 		logger.Info("Returning cached dalle for", addressIn)
// 		return a.dalleCache[fn], nil
// 	}

// 	dd := dalle.DalleDress{
// 		Original:  addressIn,
// 		Filename:  fn,
// 		Seed:      seed,
// 		AttribMap: make(map[string]dalle.Attribute),
// 	}

// 	for i := 0; i < len(dd.Seed); i = i + 8 {
// 		index := len(dd.Attribs)
// 		attr := dalle.NewAttribute(a.dbs, index, dd.Seed[i:i+6])
// 		dd.Attribs = append(dd.Attribs, attr)
// 		dd.AttribMap[attr.Name] = attr
// 		if i+4+6 < len(dd.Seed) {
// 			index = len(dd.Attribs)
// 			attr = dalle.NewAttribute(a.dbs, index, dd.Seed[i+4:i+4+6])
// 			dd.Attribs = append(dd.Attribs, attr)
// 			dd.AttribMap[attr.Name] = attr
// 		}
// 	}

// 	suff := a.Series.Suffix
// 	dd.DataPrompt, _ = dd.ExecuteTemplate(a.dataTemplate, nil)
// 	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "data"), "txt", dd.DataPrompt)
// 	dd.TitlePrompt, _ = dd.ExecuteTemplate(a.titleTemplate, nil)
// 	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "title"), "txt", dd.TitlePrompt)
// 	dd.TersePrompt, _ = dd.ExecuteTemplate(a.terseTemplate, nil)
// 	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "terse"), "txt", dd.TersePrompt)
// 	dd.Prompt, _ = dd.ExecuteTemplate(a.promptTemplate, nil)
// 	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "prompt"), "txt", dd.Prompt)
// 	fn = filepath.Join("output", a.Series.Suffix, "enhanced", dd.Filename+".txt")
// 	dd.EnhancedPrompt = ""
// 	if file.FileExists(fn) {
// 		dd.EnhancedPrompt = file.AsciiFileToString(fn)
// 	}

// 	a.dalleCache[dd.Filename] = &dd
// 	a.dalleCache[addressIn] = &dd

// 	return &dd, nil
// }

// func (a *App) GetAppSeries(addr string) string {
// 	return a.Series.String()
// }

// func (a *App) GetJson(addr string) string {
// 	if dd, err := a.MakeDalleDress(addr); err != nil {
// 		return err.Error()
// 	} else {
// 		return dd.String()
// 	}
// }

// func (a *App) GetData(addr string) string {
// 	if dd, err := a.MakeDalleDress(addr); err != nil {
// 		return err.Error()
// 	} else {
// 		return dd.DataPrompt
// 	}
// }

// func (a *App) GetTitle(addr string) string {
// 	if dd, err := a.MakeDalleDress(addr); err != nil {
// 		return err.Error()
// 	} else {
// 		return dd.TitlePrompt
// 	}
// }

// func (a *App) GetTerse(addr string) string {
// 	if dd, err := a.MakeDalleDress(addr); err != nil {
// 		return err.Error()
// 	} else {
// 		return dd.TersePrompt
// 	}
// }

// func (a *App) GetFilename(addr string) string {
// 	if dd, err := a.MakeDalleDress(addr); err != nil {
// 		return err.Error()
// 	} else {
// 		return dd.Filename
// 	}
// }

// func (a *App) GetExistingAddrs() []string {
// 	return []string{
// 		"gitcoin.eth",
// 		"giveth.eth",
// 		"chase.wright.eth",
// 		"cnn.eth",
// 		"dawid.eth",
// 		"dragonstone.eth",
// 		"eats.eth",
// 		"ens.eth",
// 		"gameofthrones.eth",
// 		"jen.eth",
// 		"makingprogress.eth",
// 		"meriam.eth",
// 		"nate.eth",
// 		"poap.eth",
// 		"revenge.eth",
// 		"rotki.eth",
// 		"trueblocks.eth",
// 		"unchainedindex.eth",
// 		"vitalik.eth",
// 		"when.eth",
// 	}
// }

// // validFilename returns a valid filename from the input string
// func validFilename(in string) string {
// 	invalidChars := []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|"}
// 	for _, char := range invalidChars {
// 		in = strings.ReplaceAll(in, char, "_")
// 	}
// 	in = strings.TrimSpace(in)
// 	in = strings.ReplaceAll(in, "__", "_")
// 	return in
// }

// // reverse returns the reverse of the input string
// func reverse(s string) string {
// 	runes := []rune(s)
// 	n := len(runes)
// 	for i := 0; i < n/2; i++ {
// 		runes[i], runes[n-1-i] = runes[n-1-i], runes[i]
// 	}
// 	return string(runes)
// }
