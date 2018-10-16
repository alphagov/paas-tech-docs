.DEFAULT_GOAL := help

ifdef VERBOSE
VERBOSE_FLAG:=--verbose
endif

LINKCHECKER := linkchecker --ignore-url=^mailto: -f ./.linkchecker.rc $(VERBOSE_FLAG)
SERVER_PORT?=4567

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: dependencies
dependencies: ## Install dependencies
	pip install -r requirements.txt
	bundle install

.PHONY: build
build: ## Builds the project
	@echo "Run middleman..."
	bundle exec middleman build $(VERBOSE_FLAG)
	@echo "Copy additional files..."
	cp googlec7239f490e1990a5.html build

.PHONY: test
test: test-filesystem test-local-http ## Runs the tests

.PHONY: test-filesystem
test-filesystem: build ## checks links against the build dir directly
	$(LINKCHECKER) ./build/

.PHONY: test-local-http
test-local-http: build ## checks links against the build dir over HTTP
	ruby \
	  -run \
	  -ehttpd \
	  ./build/ \
	  -p$(SERVER_PORT) \
	>/dev/null 2>&1 & SERVER_PID=$$! ; \
	$(LINKCHECKER) http://localhost:$(SERVER_PORT) ; \
	LINKCHECKER_STATUS=$$? ; \
	kill $${SERVER_PID} ; \
	exit $${LINKCHECKER_STATUS}
