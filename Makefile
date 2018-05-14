.DEFAULT_GOAL := help

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
	bundle exec middleman build
	@echo "Copy additional files..."
	cp googlec7239f490e1990a5.html build

.PHONY: test
test: ## Runs the tests
	bundle exec middleman build --verbose
	linkchecker ./build/
	bundle exec rspec
