import yaml from 'js-yaml'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const getFileFromPath = (filePath) => {
  const extantion = path.extname(filePath).slice(1)
  const basename = path.basename(filePath)
  const file = readFileSync(filePath)
  const allowedExts = ['json', 'yaml', 'yml']
  const isAllowedExtantion = allowedExts.includes(extantion)

  if (!isAllowedExtantion) {
    throw new Error(`Unsupported format file: ${basename}`)
  }

  if (extantion === 'yaml' || extantion === 'yml') {
    return yaml.load(file)
  }

  return JSON.parse(file)
}

export default getFileFromPath
