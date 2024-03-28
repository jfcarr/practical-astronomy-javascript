default:
	@echo 'Targets:'
	@echo '  test  -- Run unit tests'
	@echo '  doc   -- Generate documentation'

test:
	npm test

doc:
	jsdoc src/ -R README.md -r -d docs/
