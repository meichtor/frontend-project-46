import { jsonFormatter } from '../../src/formatters/json.js'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('jsonFormatter', () => {
  test('plain file', () => {
    const pathToExpected = getFixturePath('/plain/jsonFormat.txt')
    const pathToTree = getFixturePath('/plain/plainTree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = jsonFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })

  test('nested file', () => {
    const pathToExpected = getFixturePath('/nested/jsonFormat.txt')
    const pathToTree = getFixturePath('/nested/nestedTree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = jsonFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })
})
