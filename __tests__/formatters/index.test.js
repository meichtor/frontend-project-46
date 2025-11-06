import { formatDiffTree } from '../../src/formatters/index.js'
import { plainFormatter } from '../../src/formatters/plain'
import { stylishFormatter } from '../../src/formatters/stylish'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('formatValue', () => {
  test('with default/unsupported format', () => {
    const pathToTree = getFixturePath('/plain/plainTree.json')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const expected = stylishFormatter(buildedTree, 1)

    const resultDefault = formatDiffTree(buildedTree)
    const resultUnsupported = formatDiffTree(buildedTree, 'sample')

    expect(expected).toEqual(resultDefault)
    expect(expected).toEqual(resultUnsupported)
  })

  test('with expected formats', () => {
    const pathToTree = getFixturePath('/plain/plainTree.json')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const expectedStylish = stylishFormatter(buildedTree, 1)
    const expectedPlain = plainFormatter(buildedTree)

    const resultStylish = formatDiffTree(buildedTree, 'stylish')
    const resultPlain = formatDiffTree(buildedTree, 'plain')

    expect(expectedStylish).toEqual(resultStylish)
    expect(expectedPlain).toEqual(resultPlain)
  })
})
