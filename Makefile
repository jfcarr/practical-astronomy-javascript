default:
	@echo 'Targets:'
	@echo '  test  -- Run unit tests'
	@echo '  docs  -- Generate documentation'

test:
	npm test

docs:
	jsdoc src/ -R README.md -r -d docs/
