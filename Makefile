default:
	@echo 'Targets:'
	@echo '  test     -- Run unit tests'
	@echo '  publish  -- Publish to the NPM registry'
	@echo '  doc      -- Generate documentation'

test:
	npm test

publish:
	npm publish

doc:
	jsdoc src/ -R README.md -r -d docs/
