import { getFileFromPath, formatToAbsolutePath } from '../src/index.js'
import genDiff from '../src/index.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import { readFileSync } from 'node:fs'
import { cwd } from 'process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename)

describe('getFileFromPath', () => {
  test('base case with json file', () => {
    const pathToJson = getFixturePath('file1.json')
    const result = JSON.parse(readFileSync(pathToJson))

    expect(getFileFromPath(pathToJson)).toEqual(result)
  })

  test('case with unsupported format', () => {
    const pathToTxt = getFixturePath('file1.txt')
    const result = new Error('unsupported format file: file1.txt')

    expect(() => getFileFromPath(pathToTxt)).toThrow(result)
  })

  test('case with non exist json', () => {
    const pathToNonExist = getFixturePath('1111.json')

    expect(() => getFileFromPath(pathToNonExist)).toThrow()
  })
})

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
      ['base case', getFixturePath('file1.json'), getFixturePath('file2.json')],
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
