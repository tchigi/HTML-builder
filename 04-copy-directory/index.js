const { join } = require('path')
const { readdir, copyFile, mkdir, rmdir } = require('fs/promises')

const clearFolder = async (nameFolderClear) => {
  await rmdir(nameFolderClear, { recursive: true })
  await mkdir(nameFolderClear, { recursive: true })
}

const filesInFolder = async (name1_1, name1_2, name2_1, name2_2) => {
  const name1 = join(name1_1, name1_2)
  const name2 = join(name2_1, name2_2)
  await clearFolder(name2)

  const files = await readdir(name1, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile()) {
      const oldFile = join(name1, file.name)
      const newFile = join(name2, file.name)
      await copyFile(oldFile, newFile)
    } else filesInFolder(name1, file.name, name2, file.name)
  }
}

filesInFolder(__dirname, 'files', __dirname, 'files-copy')
