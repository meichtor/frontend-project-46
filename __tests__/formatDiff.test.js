import { getFormatConfig, formatValue, formatDiffTree } from '../src/formatDiff.js'
import { stylishConfig } from '../src/constants.js'
import getFixturePath from './__utils__/test-utils.js'
import { readFileSync } from 'node:fs'

describe('getFormatConfig', () => {
  test('base cases', () => {
    const expected = stylishConfig
    const result = getFormatConfig('stylish')
    const withDefaultConfig = getFormatConfig()

    expect(expected).toBe(result)

    expect(result).toHaveProperty('replacer')
    expect(result).toHaveProperty('spacesCount')
    expect(result).toHaveProperty('leftShift')
    expect(result).toHaveProperty('formatStatus')

    expect(expected).toBe(withDefaultConfig)
  })

  test('case with unknown format', () => {
    const result = () => getFormatConfig('super big format')

    expect(result).toThrow(new Error('Unsupported format: super big format'))
  })
})

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

describe('formatDiffTree', () => {
  test('base case', () => {
    const pathToExpected = getFixturePath('nestedDiff.txt')
    const pathToTree = getFixturePath('diffTree.json')

    const expectedTree = readFileSync(pathToExpected, 'utf-8')
    const buildedTree = JSON.parse(readFileSync(pathToTree, 'utf-8'))

    const formatConfig = getFormatConfig()
    const result = formatDiffTree(buildedTree, formatConfig, 1)

    expect(expectedTree).toEqual(result)
  })
})
