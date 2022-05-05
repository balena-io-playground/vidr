#!/usr/bin/env zx

const dir = "/files/OUTPUT"

const dirContent = await fs.readdir(dir)

// get all mp4 files with their relative path
const files = []

for (const folder of dirContent) {
  try {
    const currentFiles = await fs.readdir(path.join(dir, folder))
    currentFiles
      .filter((file) => file.indexOf(".mp4") > 0)
      .forEach((file) =>
        files.push({
          folder,
          file,
        })
      )
  } catch (err) {
    /*do nothing, if it's not a dir we don't care*/
  }
}

// ensure we have the right order
const orderedFiles = files.sort((a, b) => a.folder < b.folder).filter((file) => file.file && file.folder)

// get length

const augmentedFiles = []

for (const orderedFile of orderedFiles) {
  const { file, folder } = orderedFile

  const filePath = `${path.join(dir, folder, file)}`

  let length =
    await $`ffprobe -i ${filePath} -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 | cut -f 1 -d '.'`

  augmentedFiles.push({
    folder,
    file,
    length: parseInt(length.stdout),
    title: folder,
  })
}

augmentedFiles.forEach((file) => console.log(file))
