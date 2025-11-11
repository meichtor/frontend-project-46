import { formatDiffTree } from '../../src/formatters/index.js'
import { plainFormatter } from '../../src/formatters/plain'
import { stylishFormatter } from '../../src/formatters/stylish'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'
import { jsonFormatter } from '../../src/formatters/json.js'

describe('formatValue', () => {
  const pathToTree = getFixturePath('tree.json')
  const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

  test('with default/unsupported format', () => {
    const expected = stylishFormatter(buildedTree)

    const resultDefault = formatDiffTree(buildedTree)
    const resultUnsupported = formatDiffTree(buildedTree, 'sample')

    expect(expected).toEqual(resultDefault)
    expect(expected).toEqual(resultUnsupported)
  })

  test('with supported formats', () => {
    const expectedJson = jsonFormatter(buildedTree)
    const resultJson = formatDiffTree(buildedTree, 'json')

    const expectedStylish = stylishFormatter(buildedTree)
    const resultStylish = formatDiffTree(buildedTree, 'stylish')

    const expectedPlain = plainFormatter(buildedTree)
    const resultPlain = formatDiffTree(buildedTree, 'plain')

    expect(expectedJson).toEqual(resultJson)
    expect(expectedStylish).toEqual(resultStylish)
    expect(expectedPlain).toEqual(resultPlain)
  })
})
