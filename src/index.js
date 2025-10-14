import { readFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'

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

  console.log(parsedFile1)
  console.log(parsedFile2)
}

export default genDiff
