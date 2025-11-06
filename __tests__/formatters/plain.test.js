import { formatValue, plainFormatter } from '../../src/formatters/plain.js'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('formatValue', () => {
  test('cases with different value types', () => {
    expect('[complex value]').toBe(formatValue({}))
    expect('[complex value]').toBe(formatValue([1, 2, 3]))
    expect(1).toBe(formatValue(1))
    expect(`'str'`).toBe(formatValue('str'))
    expect(null).toBe(formatValue(null))
  })
})

describe('plainFormatter', () => {
  test('plain file', () => {
    const pathToExpected = getFixturePath('/plain/plainFormat.txt')
    const pathToTree = getFixturePath('/plain/plainTree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = plainFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })

  test('nested file', () => {
    const pathToExpected = getFixturePath('/nested/plainFormat.txt')
    const pathToTree = getFixturePath('/nested/nestedTree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = plainFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })
})
