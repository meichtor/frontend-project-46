import { formatValue, stylishFormatter } from '../../src/formatters/stylish.js'
import getFixturePath from '../__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('formatValue', () => {
  describe('cases with default/different args', () => {
    const obj = {
      field: '1',
    }
    test.each([
      {
        expected: ['{', `${' '.repeat(4)}field: 1`, '}'].join('\n'),
        result: formatValue(obj, 1),
      },
      {
        expected: ['{', `${'  '.repeat(2)}field: 1`, '}'].join('\n'),
        result: formatValue(obj, 1, '  ', 2),
      },
      {
        expected: ['{', `field: 1`, '}'].join('\n'),
        result: formatValue(obj, 1, '   ', 0),
      },
      {
        expected: ['{', `${'.'.repeat(4)}field: 1`, '}'].join('\n'),
        result: formatValue(obj, 1, '.', 4),
      },
    ])('.formatValue($expected, $result)', ({ expected, result }) => {
      expect(expected).toEqual(result)
    })
  })

  describe('cases with different value types', () => {
    expect('1').toBe(formatValue(1))
    expect(['{', `0: 1`, `1: 2`, `2: 3`, '}'].join('\n')).toBe(formatValue([1, 2, 3], 1, '', 0))
    expect('').toBe(formatValue(''))
  })
})

describe('stylishFormatter', () => {
  test('check valid format', () => {
    const pathToExpected = getFixturePath('outputStylish.txt')
    const pathToTree = getFixturePath('tree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const result = stylishFormatter(buildedTree)

    expect(expectedTree).toEqual(result)
  })
})
