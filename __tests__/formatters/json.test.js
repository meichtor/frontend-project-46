import { jsonFormatter } from '../../src/formatters/json.js'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('jsonFormatter', () => {
  test('check valid format', () => {
    const pathToExpected = getFixturePath('outputJson.txt')
    const pathToTree = getFixturePath('tree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = jsonFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })
})
