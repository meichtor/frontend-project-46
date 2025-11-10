import _ from 'lodash'

const config = {
  replacer: ' ',
  spacesCount: 4,
  leftShift: 2,
  typeSymols: {
    added: '+ ',
    deleted: '- ',
    unchanged: '  ',
    nested: '  ',
    changed: {
      oldValue: '- ',
      newValue: '+ ',
    },
  },
}

const formatValue = (currValue, depth, replacer = ' ', spacesCount = 4) => {
  if (!_.isObject(currValue)) {
    return `${currValue}`
  }

  const lines = Object
    .entries(currValue)
    .map(([key, value]) => `${replacer.repeat(depth * spacesCount)}${key}: ${formatValue(value, depth + 1, replacer, spacesCount)}`)

  const bracketsIndent = depth * spacesCount - spacesCount

  return [
    '{',
    ...lines,
    `${' '.repeat(bracketsIndent)}}`,
  ].join('\n')
}

const stylishFormatter = (tree, depth = 1) => {
  const { replacer, spacesCount, leftShift, typeSymols } = config

  const iter = (node, depth) => node.flatMap((node) => {
    const { key, type, value, children } = node
    const nextDepth = depth + 1
    const indentsCount = depth * spacesCount - leftShift
    const symbol = typeSymols[type]

    switch (type) {
      case 'nested': {
        return `${replacer.repeat(indentsCount)}${symbol}${key}: ${stylishFormatter(children, nextDepth)}`
      }

      case 'added': {
        return `${replacer.repeat(indentsCount)}${symbol}${key}: ${formatValue(value, nextDepth, replacer, spacesCount)}`
      }

      case 'deleted': {
        return `${replacer.repeat(indentsCount)}${symbol}${key}: ${formatValue(value, nextDepth, replacer, spacesCount)}`
      }

      case 'changed': {
        return [
          `${replacer.repeat(indentsCount)}${symbol.oldValue}${key}: ${formatValue(node.oldValue, nextDepth, replacer, spacesCount)}`,
          `${replacer.repeat(indentsCount)}${symbol.newValue}${key}: ${formatValue(node.newValue, nextDepth, replacer, spacesCount)}`,
        ].join('\n')
      }

      default: {
        return `${replacer.repeat(indentsCount)}${symbol}${key}: ${formatValue(value, nextDepth, replacer, spacesCount)}`
      }
    }
  })

  const diff = iter(tree, depth)
  const bracketsIndent = depth * spacesCount - spacesCount

  return [
    '{',
    ...diff,
    `${replacer.repeat(bracketsIndent)}}`,
  ].join('\n')
}

export { stylishFormatter, formatValue }
