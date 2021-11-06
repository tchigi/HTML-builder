const { join, extname } = require('path')
const { readdir } = require('fs/promises')
const { createWriteStream, createReadStream } = require('fs')

const fileBundel = join(__dirname, 'project-dist', 'bundle.css')
const writeStream = createWriteStream(fileBundel, 'utf-8')

const addFileInfo = (fileName) => {
  const readableStream = createReadStream(fileName, 'utf-8')

  readableStream.on('data', (chunk) => writeStream.write(chunk))
}

const filesInFolder = async (name1_1, name1_2) => {
  const name1 = join(name1_1, name1_2)
  const files = await readdir(name1, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile()) {
      const type = extname(file.name)
      const oldFile = join(name1, file.name)

      if (type === '.css') addFileInfo(oldFile)
    } else filesInFolder(name1, file.name)
  }
}

filesInFolder(__dirname, 'styles')
