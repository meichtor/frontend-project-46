import { formatToAbsolutePath, buildDiffTree } from '../src/index.js'
import genDiff from '../src/index.js'
import path from 'path'
import { readFileSync } from 'node:fs'
import { cwd } from 'process'
import getFixturePath from './__utils__/test-utils.js'

describe('formatToAbsolutePath', () => {
  test('base case', () => {
    const pathName = './before1.json'
    const result = formatToAbsolutePath(pathName)

    expect(path.isAbsolute(result)).toBe(true)
    expect(result).toContain(cwd())
    expect(result).toEqual(path.resolve(cwd(), pathName))
  })

  test('case with relative path', () => {
    const pathName = '../../before1.yml'
    const result = formatToAbsolutePath(pathName)
    expect(result).toEqual(path.resolve(cwd(), pathName))
  })
})

describe('buildDiffTree', () => {
  test('base case', () => {
    const filePath1 = getFixturePath('before1.json')
    const filePath2 = getFixturePath('before2.json')
    const pathToExpected = getFixturePath('tree.json')

    const obj1 = JSON.parse(readFileSync(filePath1, 'utf-8'))
    const obj2 = JSON.parse(readFileSync(filePath2, 'utf-8'))

    const expectedTree = JSON.parse(readFileSync(pathToExpected, 'utf-8'))
    const resultTree = buildDiffTree(obj1, obj2)

    expect(resultTree).toBeInstanceOf(Array)
    expect(expectedTree).toEqual(resultTree)
  })

  test('case with empty objects', () => {
    const resultTree = buildDiffTree({}, {})

    expect(resultTree).toBeInstanceOf(Array)
    expect(resultTree).toHaveLength(0)
  })

  test('case with equal objects', () => {
    const obj = { field: 'test' }
    const resultTree = buildDiffTree(obj, obj)

    expect(resultTree).toHaveLength(1)
    expect(resultTree[0]).toHaveProperty('type', 'unchanged')
  })
})

describe('genDiff', () => {
  describe('with different formats', () => {
    test.each([
      [getFixturePath('before1.json'), getFixturePath('before2.json')],
      [getFixturePath('before1.yaml'), getFixturePath('before2.yml')],
      [getFixturePath('before1.yaml'), getFixturePath('before2.json')],
    ])('%s', (pathToFile1, pathToFile2) => {
      const pathToDiffFile = getFixturePath('outputStylish.txt')
      const result = genDiff(pathToFile1, pathToFile2)
      const expectedDiff = readFileSync(pathToDiffFile, 'utf-8')

      expect(typeof result).toBe('string')
      expect(result).toBe(expectedDiff)
    })
  })

  describe('invalid args', () => {
    test.each([
      ['', getFixturePath('before2.json')],
      ['', ''],
      [getFixturePath('before1.txt'), getFixturePath('before2.json')],
    ])('%s', (pathToFile1, pathToFile2) => {
      expect(() => genDiff(pathToFile1, pathToFile2)).toThrow()
    })
  })
})
