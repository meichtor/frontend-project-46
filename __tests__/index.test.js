import { formatToAbsolutePath } from '../src/index.js'
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

describe('genDiff', () => {
  describe('success cases', () => {
    test.each([
      ['json format', getFixturePath('file1.json'), getFixturePath('file2.json')],
      ['yaml format', getFixturePath('file1.yaml'), getFixturePath('file2.yaml')],
      ['yml format', getFixturePath('file1.yml'), getFixturePath('file2.yml')],
      ['relative paths', './__fixtures__/file1.json', './__fixtures__/file2.json'],
    ])('%s', (_, pathToFile1, pathToFile2) => {
      const pathToDiffFile = getFixturePath('jsonDiff.txt')
      const result = genDiff(pathToFile1, pathToFile2)
      const expectedDiff = readFileSync(pathToDiffFile, 'utf-8')

      expect(typeof result).toBe('string')
      expect(result).toBe(expectedDiff)
    })
  })

  describe('invalid args', () => {
    test.each([
      ['one of paths is empty', '', getFixturePath('file2.json')],
      ['both paths is empty', '', ''],
      ['unsupported format file', getFixturePath('file1.txt'), getFixturePath('file2.json')],
    ])('%s', (_, pathToFile1, pathToFile2) => {
      expect(() => genDiff(pathToFile1, pathToFile2)).toThrow()
    })
  })
})
