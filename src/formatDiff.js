import _ from 'lodash'
import { stylishConfig } from './constants.js'

const getFormatConfig = (format = 'stylish') => {
  switch (format) {
    case 'stylish': {
      return stylishConfig
    }

    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const formatValue = (currValue, depth, replacer = ' ', spacesCount = 4) => {
  if (!_.isObject(currValue)) {
    return `${currValue}`
  }

  const lines = Object
    .entries(currValue)
    .map(([key, value]) => `${replacer.repeat(depth * spacesCount)}${key}: ${formatValue(value, depth + 1, replacer)}`)

  const bracketsIndent = depth * spacesCount - spacesCount

  return [
    '{',
    ...lines,
    `${replacer.repeat(bracketsIndent)}}`,
  ].join('\n')
}

const formatDiffTree = (tree, config, depth) => {
  const { spacesCount, replacer, formatStatus, leftShift } = config
  const indent = depth * spacesCount - leftShift
  const indentStr = replacer.repeat(indent)

  const diff = tree.flatMap((node) => {
    const { key, type, value, children } = node
    const status = formatStatus[type]
    const nextDepth = depth + 1

    if (type === 'nested') {
      return `${indentStr}${status}${key}: ${formatDiffTree(children, config, nextDepth)}`
    }

    if (type === 'changed') {
      return [
        `${indentStr}${status.oldValue}${key}: ${formatValue(node.oldValue, nextDepth, replacer)}`,
        `${indentStr}${status.newValue}${key}: ${formatValue(node.newValue, nextDepth, replacer)}`,
      ]
    }

    return `${indentStr}${status}${key}: ${formatValue(value, nextDepth, replacer)}`
  })

  const bracketsIndent = indent - spacesCount + leftShift

  return [
    '{',
    ...diff,
    `${replacer.repeat(bracketsIndent)}}`,
  ].join('\n')
}

export { formatDiffTree, formatValue, getFormatConfig }
