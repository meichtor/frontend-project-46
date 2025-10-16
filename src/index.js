import { readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import _ from 'lodash'

const getFileFromPath = (filepath) => {
  const extantion = path.extname(filepath).slice(1)
  const file = readFileSync(filepath)

  if (extantion === 'json') {
    return JSON.parse(file)
  }

  const basename = path.basename(filepath)
  return `Unsupported format file ${basename}`
}

const formatPath = pathName => path.resolve(cwd(), pathName)

const genDiff = (filePath1, filePath2) => {
  const formattedPath1 = formatPath(filePath1)
  const formattedPath2 = formatPath(filePath2)
  const parsedFile1 = getFileFromPath(formattedPath1)
  const parsedFile2 = getFileFromPath(formattedPath2)
  const sortedKeys1 = _.sortBy(Object.keys(parsedFile1))
  const sortedKeys2 = _.sortBy(Object.keys(parsedFile2))
  const allUniqKeys = _.union(sortedKeys1, sortedKeys2)

  const diffString = allUniqKeys.reduce((acc, key) => {
    const indent = ' '.repeat(2)
    const value1 = parsedFile1[key]
    const value2 = parsedFile2[key]

    if (sortedKeys2.includes(key)) {
      if (!value1) {
        return acc += `${indent}+ ${key}: ${value2}\n`
      }

      if (value1 === value2) {
        return acc += `${indent.repeat(2)}${key}: ${value1}\n`
      }

      return acc += `${indent}- ${key}: ${value1}\n${indent}+ ${key}: ${value2}\n`
    }

    return acc += `${indent}- ${key}: ${value1}\n`
  }, '\n')

  console.log(`{${diffString}}`)
}

export default genDiff
