import { stylishFormatter } from './stylish.js'
import { plainFormatter } from './plain.js'

export const formatDiffTree = (tree, format) => {
  switch (format) {
    case 'stylish': {
      return stylishFormatter(tree, 1)
    }

    case 'plain': {
      return plainFormatter(tree)
    }

    default:
      return stylishFormatter(tree, 1)
  }
}
