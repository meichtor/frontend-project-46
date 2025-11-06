import { formatToAbsolutePath, buildDiffTree } from '../src/index.js'
import genDiff from '../src/index.js'
import path from 'path'
import { readFileSync } from 'node:fs'
import { cwd } from 'process'
import getFixturePath from './__utils__/test-utils.js'

describe('formatToAbsolutePath', () => {
  test('base case', () => {
    const pathName = './file1.json'
    const result = formatToAbsolutePath(pathName)

    expect(path.isAbsolute(result)).toBe(true)
    expect(result).toContain(cwd())
    expect(result).toEqual(path.resolve(cwd(), pathName))
  })

  test('case with relative path', () => {
    const pathName = '../../file1.json'
    const result = formatToAbsolutePath(pathName)
    expect(result).toEqual(path.resolve(cwd(), pathName))
  })
})

describe('buildDiffTree', () => {
  test('base case', () => {
    const filePath1 = getFixturePath('/nested/nested1.json')
    const filePath2 = getFixturePath('/nested/nested2.json')
    const pathToExpected = getFixturePath('/nested/nestedTree.json')
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
  describe('plain cases', () => {
    test.each([
      ['json format', getFixturePath('/plain/file1.json'), getFixturePath('/plain/file2.json')],
      ['yaml format', getFixturePath('/plain/file1.yaml'), getFixturePath('/plain/file2.yaml')],
      ['yml format', getFixturePath('/plain/file1.yml'), getFixturePath('/plain/file2.yml')],
      ['relative paths', './__fixtures__/plain/file1.json', './__fixtures__/plain/file2.json'],
    ])('%s', (_, pathToFile1, pathToFile2) => {
      const pathToDiffFile = getFixturePath('/plain/stylishFormat.txt')
      const result = genDiff(pathToFile1, pathToFile2)
      const expectedDiff = readFileSync(pathToDiffFile, 'utf-8')

      expect(typeof result).toBe('string')
      expect(result).toBe(expectedDiff)
    })
  })

  describe('nested cases', () => {
    test.each([
      ['json format', getFixturePath('/nested/nested1.json'), getFixturePath('/nested/nested2.json')],
      ['yaml format', getFixturePath('/nested/nested1.yaml'), getFixturePath('/nested/nested2.yaml')],
    ])('%s', (_, pathToFile1, pathToFile2) => {
      const pathToDiffFile = getFixturePath('/nested/stylishFormat.txt')
      const result = genDiff(pathToFile1, pathToFile2)
      const expectedDiff = readFileSync(pathToDiffFile, 'utf-8')

      expect(typeof result).toBe('string')
      expect(result).toBe(expectedDiff)
    })
  })

  describe('invalid args', () => {
    test.each([
      ['one of paths is empty', '', getFixturePath('/plain/file2.json')],
      ['both paths is empty', '', ''],
      ['unsupported format file', getFixturePath('/plain/file1.txt'), getFixturePath('/plain/file2.json')],
    ])('%s', (_, pathToFile1, pathToFile2) => {
      expect(() => genDiff(pathToFile1, pathToFile2)).toThrow()
    })
  })
})
