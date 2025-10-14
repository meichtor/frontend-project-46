install:
	npm ci

lint:
	npx eslint .

gendiff:
	node ./bin/genDiff.js