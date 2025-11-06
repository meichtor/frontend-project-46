import _ from 'lodash'

const formatValue = (value) => {
  if (_.isObject(value)) {
    return `[complex value]`
  }

  if (_.isString(value)) {
    return `'${value}'`
  }

  return value
}

const plainFormatter = (tree) => {
  const getDiff = (node, parent) => node
    .flatMap((node) => {
      const { key, value, type, children } = node
      const property = parent ? `${parent}.${key}` : `${key}`

      switch (type) {
        case 'nested': {
          return getDiff(children, property)
        }

        case 'added': {
          return `Property '${property}' was added with value: ${formatValue(value)}`
        }

        case 'deleted': {
          return `Property '${property}' was removed`
        }

        case 'changed': {
          return `Property '${property}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`
        }

        default: {
          return ''
        }
      }
    })
    .filter(line => line !== '')
    .join('\n')

  return getDiff(tree)
}

export { plainFormatter, formatValue }
