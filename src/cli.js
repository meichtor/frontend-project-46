import { program } from 'commander'
import genDiff from './index.js'

const initCli = () => {
  program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format [type]', 'output format')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .action((filePath1, filePath2) => {
      const diff = genDiff(filePath1, filePath2)
      console.log(diff)
    })

  program.parse()
}

export default initCli
