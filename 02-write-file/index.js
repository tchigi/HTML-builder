const { createWriteStream } = require('fs')
const { join } = require('path')
const { stdin, stdout } = require('process')
const { createInterface } = require('readline')

const linkResult = join(__dirname, 'text.txt')
const writeStream = createWriteStream(linkResult, 'utf-8')
const rl = createInterface({ input: stdin, output: stdout })

stdout.write(`Приветствую! Можете начать вводить свой текст: \n`)

const exit = () => {
  rl.close()
  writeStream.end()
  stdout.write(`До свидания! \n`)
}

rl.on('line', (input) => {
  if (input.indexOf('exit') === -1) writeStream.write(`${input} \n`)
  else exit()
})

rl.on('SIGINT', () => exit())
