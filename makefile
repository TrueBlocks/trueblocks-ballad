.PHONY: app

app:
	@rm -fR build/bin
	@wails build
	@open build/bin/TrueBlocks\ Ballad.app/

update:
	@go mod tidy
	@cd frontend ; yarn upgrade --latest ; cd -

lint:
	@yarn lint

test:
	@export $(grep -v '^#' ../.env | xargs) >/dev/null && yarn test

generate:
	@cd ~/Development/trueblocks-core/build && make -j 12 goMaker && cd -
	@goMaker

clean:
	@rm -fR node_modules
	@rm -fR frontend/node_modules
	@rm -fR build/bin

