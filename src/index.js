import { cwd } from 'node:process'
import _ from 'lodash'
import path from 'node:path'
import getFileFromPath from './parsers.js'
import { formatDiffTree } from './formatters/index.js'

export const formatToAbsolutePath = pathName => path.resolve(cwd(), pathName)

export const buildDiffTree = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const uniqKeys = _.union(keys1, keys2).sort()

  return uniqKeys.map((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildDiffTree(value1, value2),
      }
    }

    if (!Object.hasOwn(obj1, key)) {
      return {
        key,
        type: 'added',
        value: value2,
      }
    }

    if (!Object.hasOwn(obj2, key)) {
      return {
        key,
        type: 'deleted',
        value: value1,
      }
    }

    if (value1 !== value2) {
      return {
        key,
        type: 'changed',
        oldValue: value1,
        newValue: value2,
      }
    }

    return {
      key,
      type: 'unchanged',
      value: value1,
    }
  })
}

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const formattedPath1 = formatToAbsolutePath(filePath1)
  const formattedPath2 = formatToAbsolutePath(filePath2)
  const parsedFile1 = getFileFromPath(formattedPath1)
  const parsedFile2 = getFileFromPath(formattedPath2)
  const diffTree = buildDiffTree(parsedFile1, parsedFile2)
  const formattedDiff = formatDiffTree(diffTree, format)

  return formattedDiff
}

export default genDiff
