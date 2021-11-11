const { join, extname } = require('path')
const { readdir, mkdir, copyFile, rm } = require('fs/promises')
const { createWriteStream, createReadStream } = require('fs')
const { stdout } = require('process')

const dist = join(__dirname, 'project-dist')
const reg = /[{]+[a-zA-Z0-9]+[}]+/g

const clearFolder = async (nameFolderClear) => {
  await rm(nameFolderClear, { recursive: true, force: true })
  await mkdir(nameFolderClear, { recursive: true })
}

const filesInFolderStyle = async (name1_1, name1_2, writeStream) => {
  const name1 = join(name1_1, name1_2)
  const files = await readdir(name1, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile()) {
      const type = extname(file.name)
      const oldFile = join(name1, file.name)

      if (type === '.css') {
        const readableStream = createReadStream(oldFile, 'utf-8')
        readableStream.on('data', (chunk) => writeStream.write(chunk))
      }
    } else filesInFolderStyle(name1, file.name)
  }
}

const styleContent = async (dist, name) => {
  const fileBundel = join(dist, name)
  const writeStream = createWriteStream(fileBundel, 'utf-8')
  filesInFolderStyle(__dirname, 'styles', writeStream)
}

const fileInFolderAssets = async (name1_1, name1_2, name2_1, name2_2) => {
  const name1 = join(name1_1, name1_2)
  const name2 = join(name2_1, name2_2)
  await clearFolder(name2)

  const files = await readdir(name1, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile()) {
      const oldFile = join(name1, file.name)
      const newFile = join(name2, file.name)
      await copyFile(oldFile, newFile)
    } else fileInFolderAssets(name1, file.name, name2, file.name)
  }
}

const readFileComp = (item) => {
  let nameFile = item.replace('{{', '')
  nameFile = nameFile.replace('}}', '')
  const linkFile = join(__dirname, 'components', `${nameFile}.html`)
  const readableStream = createReadStream(linkFile, 'utf8')

  return readableStream
}

const writeFile = (text) => {
  const linkResult = join(dist, 'index.html')
  const writeStream = createWriteStream(linkResult, 'utf-8')
  writeStream.write(text)
  writeStream.end()
}

const readFileHtml = () => {
  const linkFile = join(__dirname, 'template.html')
  const readableStream = createReadStream(linkFile, 'utf8')
  let arr = []
  let textHTML = ''

  readableStream.on('data', (chunk) => {
    arr = chunk.match(reg)
    textHTML = chunk
  })

  readableStream.on('end', () => {
    arr.forEach((item, i) => {
      const steam = readFileComp(item)
      steam.on('data', (chunk) => {
        textHTML = textHTML.replace(item, chunk)
      })
      steam.on('end', () => {
        if (i === arr.length - 1) writeFile(textHTML)
      })
    })
  })
}

const init = async () => {
  await clearFolder(dist)
  await styleContent(dist, 'style.css')
  await fileInFolderAssets(__dirname, 'assets', dist, 'assets')
  await readFileHtml()
}

init()
