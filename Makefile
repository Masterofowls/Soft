setup:
	npm ci
lint:
	npx eslint
stryker:
	npx stryker run
test:
	npm run test