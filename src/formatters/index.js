import { stylishFormatter } from './stylish.js'
import { plainFormatter } from './plain.js'
import { jsonFormatter } from './json.js'

export const formatDiffTree = (tree, format) => {
  switch (format) {
    case 'stylish': {
      return stylishFormatter(tree)
    }

    case 'plain': {
      return plainFormatter(tree)
    }

    case 'json': {
      return jsonFormatter(tree)
    }

    default:
      return stylishFormatter(tree)
  }
}
