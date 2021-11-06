const { join, extname, basename } = require('path')
const { stdout } = require('process')
const { readdir, stat } = require('fs/promises')

const linkSecretFolder = join(__dirname, 'secret-folder')

const informationAboutFile = async (fileName) => {
  const linkFile = join(linkSecretFolder, fileName)
  const type = extname(fileName)
  const name = basename(fileName, type)
  const size = (await stat(linkFile)).size

  stdout.write(`${name} - ${type.slice(1)} - ${size}b \n`)
}

const filesInFolder = async (nameFolder) => {
  const files = await readdir(nameFolder, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile()) informationAboutFile(file.name)
  }
}

filesInFolder(linkSecretFolder)
