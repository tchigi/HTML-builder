const { createReadStream } = require('fs')
const { join } = require('path')
const { stdout } = require('process')

const linkFile = join(__dirname, 'text.txt')
const readableStream = createReadStream(linkFile, 'utf8')

readableStream.on('data', (chunk) => stdout.write(chunk))
