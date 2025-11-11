import getFixturePath from './__utils__/test-utils.js'
import yaml from 'js-yaml'
import getFileFromPath from '../src/parsers.js'
import { readFileSync } from 'node:fs'

describe('getFileFromPath', () => {
  test('with supported file formats', () => {
    const pathToJson = getFixturePath('before1.json')
    const pathToYaml = getFixturePath('before1.yaml')
    const jsonResult = getFileFromPath(pathToJson)
    const yamlResult = getFileFromPath(pathToYaml)
    const expectedJson = JSON.parse(readFileSync(pathToJson))
    const expectedYaml = yaml.load(readFileSync(pathToYaml))

    expect(expectedJson).toEqual(jsonResult)
    expect(expectedYaml).toEqual(yamlResult)
  })

  test('with unsupported formats', () => {
    const pathToTxt = getFixturePath('before1.txt')
    const result = new Error('Unsupported format file: before1.txt')

    expect(() => getFileFromPath(pathToTxt)).toThrow(result)
  })

  test('case with non exist file', () => {
    const pathToNonExist = getFixturePath('1111.json')

    expect(() => getFileFromPath(pathToNonExist)).toThrow()
  })
})
