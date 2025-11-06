import getFixturePath from './__utils__/test-utils.js'
import yaml from 'js-yaml'
import getFileFromPath from '../src/parsers.js'
import { readFileSync } from 'node:fs'

describe('getFileFromPath', () => {
  test('base case with supported file formats', () => {
    const pathToJson = getFixturePath('/plain/file1.json')
    const pathToYaml = getFixturePath('/plain/file1.yaml')
    const jsonResult = getFileFromPath(pathToJson)
    const yamlResult = getFileFromPath(pathToYaml)
    const expectedJson = JSON.parse(readFileSync(pathToJson))
    const expectedYaml = yaml.load(readFileSync(pathToYaml))

    expect(expectedJson).toEqual(jsonResult)
    expect(expectedYaml).toEqual(yamlResult)
  })

  test('case with unsupported format', () => {
    const pathToTxt = getFixturePath('/plain/file1.txt')
    const result = new Error('Unsupported format file: file1.txt')

    expect(() => getFileFromPath(pathToTxt)).toThrow(result)
  })

  test('case with non exist file', () => {
    const pathToNonExist = getFixturePath('1111.json')

    expect(() => getFileFromPath(pathToNonExist)).toThrow()
  })
})
