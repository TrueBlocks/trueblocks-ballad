.PHONY: app

update:
	@go get "github.com/TrueBlocks/trueblocks-sdk/v5@latest"
	@go get github.com/TrueBlocks/trueblocks-core/src/apps/chifra@latest
	@go mod tidy

lint:
	@yarn lint

test:
	@export $(grep -v '^#' ../.env | xargs) >/dev/null && go test ./...

clean:
	@rm -fR node_modules
	@rm -fR build/bin

