lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

test:
	npm test -s

test-coverage:
	npm test -- --coverage --coverageProvider=v8
