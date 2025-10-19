import { readFileSync } from 'node:fs'
import path from 'path'
import { cwd } from 'process'
import _ from 'lodash'

export const getFileFromPath = (filePath) => {
  const extantion = path.extname(filePath).slice(1)
  const basename = path.basename(filePath)
  const file = readFileSync(filePath)

  if (extantion !== 'json') {
    throw new Error(`unsupported format file: ${basename}`)
  }

  return JSON.parse(file)
}

export const formatToAbsolutePath = pathName => path.resolve(cwd(), pathName)

const genDiff = (filePath1, filePath2) => {
  const formattedPath1 = formatToAbsolutePath(filePath1)
  const formattedPath2 = formatToAbsolutePath(filePath2)
  const parsedFile1 = getFileFromPath(formattedPath1)
  const parsedFile2 = getFileFromPath(formattedPath2)
  const sortedKeys1 = _.sortBy(Object.keys(parsedFile1))
  const sortedKeys2 = _.sortBy(Object.keys(parsedFile2))
  const allUniqKeys = _.union(sortedKeys1, sortedKeys2)

  const diffString = allUniqKeys.map((key) => {
    const indent = ' '.repeat(2)
    const value1 = parsedFile1[key]
    const value2 = parsedFile2[key]
    const isKeyInFile2 = sortedKeys2.includes(key)

    if (!isKeyInFile2) {
      return `${indent}- ${key}: ${value1}`
    }

    if (!value1) {
      return `${indent}+ ${key}: ${value2}`
    }

    if (value1 === value2) {
      return `${indent.repeat(2)}${key}: ${value1}`
    }

    return `${indent}- ${key}: ${value1}\n${indent}+ ${key}: ${value2}`
  }).join('\n')

  const diffWithBraces = `{\n${diffString}\n}`

  return diffWithBraces
}

export default genDiff
