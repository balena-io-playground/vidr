#!/usr/bin/env zx

const dir = "/files/OUTPUT"

// List all files and informations we're going to need
const dirContent = await fs.readdir(dir)

// get all mp4 files with their relative path
const files = []

console.log('* dirContent', dirContent)

for (const folder of dirContent) {
  try {
    console.log('----')
    console.log('* Processing Folder:', folder)
    const currentFiles = await fs.readdir(path.join(dir, folder))
    const mp4 = currentFiles.find((file) => file.indexOf(".mp4") > 0)
    const processors = {
      caption: currentFiles.includes("caption.md"),
      audioOverlay: currentFiles.find((file) => file.indexOf(".aac") > 0) ?? false,
      trim: currentFiles.includes("trim.md"),
      overlay: currentFiles.includes("overlay.png"),
      overlayParameters: currentFiles.includes("overlay.md"),
    }

    const filePath = `${path.join(dir, folder, mp4)}`
    const length =
      await $`ffprobe -i ${filePath} -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 | cut -f 1 -d '.'`

    files.push({
      folder,
      file: mp4,
      processors,
      duration: parseInt(length.stdout),
    })
  } catch (err) {
    console.log(`* error in ${folder}`, err)
    /*do nothing, if it's not a dir we don't care*/
  }
}

console.log('*** files to process:', JSON.stringify(files))

// ensure we have the right order
const orderedFiles = files
  .sort((a, b) => a.folder < b.folder)
  .filter((file) => file.file && file.folder)
  .map((file, index) => ({ ...file, position: index }))

// start the actual processing
for (const clip of orderedFiles) {
  const { audioOverlay, trim, overlay, caption, overlayParameters } = clip.processors
  const { file, folder } = clip
  const basePath = path.join(dir, folder)
  const mp4Path = path.join(dir, folder, file)
  const mp4OutputPath = path.join(dir, folder, `output-${file}`)

  console.log("start processing", clip.folder, clip.file)

  console.log("1. Trim")
  if (trim) {
    //FIXME: this is not robust at all
    const trimContent = await fs.readFile(path.join(basePath, "trim.md"), "utf8")
    const trimText = trimContent.split(/\r?\n/)
    const startTime = trimText
      .find((line) => line.indexOf("start") > 0)
      .split("-")[1]
      .split(":")
    const stopTime = trimText
      .find((line) => line.indexOf("end") > 0)
      .split("-")[1]
      .split(":")
    const startFrame = (startTime[0] * 3600 + startTime[1] * 60 + startTime[2]) * 30
    const stopFrame = (stopTime[0] * 3600 + stopTime[1] * 60 + stopTime[2]) * 30
    await $`melt ${mp4Path} in=${startFrame} out=${stopFrame} -consumer avformat:${mp4OutputPath} -codec copy`
    await fs.move(mp4OutputPath, mp4Path, { overwrite: true }) // replace the source by the output for next step
  }

  // ADD AUDIO OVERLAY
  // Note we add audio before trim, so if the audio is longer than vid, the trimming is applied on both
  console.log("2.1 Audio")
  if (audioOverlay) {
    await $`melt ${mp4Path} -audio-track ${path.join(basePath, audioOverlay)} -consumer avformat:${mp4OutputPath} -codec copy`
    await fs.move(mp4OutputPath, mp4Path, { overwrite: true }) // replace the source by the output for next step

    // TRIM
    // TODO: replace this second trim with a start, end arguments on audio overlay
    console.log("2.2 Trim again with audio in case it's became too long")
    if (trim) {
      //FIXME: this is not robust at all
      const trimContent = await fs.readFile(path.join(basePath, "trim.md"), "utf8")
      const trimText = trimContent.split(/\r?\n/)
      const startTime = trimText
        .find((line) => line.indexOf("start") > 0)
        .split("-")[1]
        .split(":")
      const stopTime = trimText
        .find((line) => line.indexOf("end") > 0)
        .split("-")[1]
        .split(":")
      const startFrame = (startTime[0] * 3600 + startTime[1] * 60 + startTime[2]) * 30
      const stopFrame = (stopTime[0] * 3600 + stopTime[1] * 60 + stopTime[2]) * 30
      await $`melt ${mp4Path} in=${startFrame} out=${stopFrame} -consumer avformat:${mp4OutputPath} -codec copy`
      await fs.move(mp4OutputPath, mp4Path, { overwrite: true }) // replace the source by the output for next step
    }
  }

  // ADD CAPTION
  console.log("3. Caption")
  if (caption) {
    const captionContent = await fs.readFile(path.join(basePath, "caption.md"), "utf8")
    const captionText = captionContent.split(/\r?\n/)[1] // TODO: this is not optimal at all
    await $`xvfb-run -a melt /usr/src/assets/lower_thirds/lower_thirds.mov -attach dynamictext:${captionText} bgcolour=0x00000000 fgcolour="#2a506f" geometry="8%/82%:100%x100%:100" family="SourceSansPro-regular" valign="top" size="85" in=25 out=150 -track ${mp4Path} -transition composite fill=1 a_track=1 b_track=0 -consumer avformat:${mp4OutputPath} -codec copy`
    await fs.move(mp4OutputPath, mp4Path, { overwrite: true }) // replace the source by the output for next step
  }
}

// then assemble
const assemblyLine = orderedFiles.map((clip) => path.join(dir, clip.folder, clip.file))
const assemblyOutputPath = path.join(dir, "output-assembly.mp4")
await $`xvfb-run -a melt ${assemblyLine} -mix 25 -mixer luma -mixer mix:-1 -consumer avformat:${assemblyOutputPath} -codec copy`

// // add the optional music underlay
// try {
//   const underlay = await fs.stat(path.join(dir, 'underlay.aac'))
//   if(underlay) {
//     //const duration = await $`ffprobe -i ${assemblyOutputPath} -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 | cut -f 1 -d '.'`
//     //const endframe = parseInt(dur) * 30
//     //const mp4OutputPath = path.join(dir, 'output-underlay.mp4')
//     await $`xvfb-run -a melt ${assemblyOutputPath} -audio-track -blank 100 underlay.aac -attach-clip volume gain=-12db -transition mix in=0 out=60000 a_track=0 b_track=1`
//     // await $`melt ${assembyOutputPath} in=0 out=endframe -consumer avformat:${mp4OutputPath} -codec copy`
//     // fs.move(mp4OutputPath, assemblyOutputPath, { overwrite: true }) // replace the source by the output for next step
//   }
// } catch(err) { 
//   //we don't care
// }

// finaly add the metadata (chapters, etc.)

// export metadata

const formatPosition = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().length < 2 ? `0${h}` : h}:${m.toString().length < 2 ? `0${m}` : m}:${s.toString().length < 2 ? `0${s}` : s}`
}

const finalOutputPath = path.join(dir, "output.mp4")
const metaPath = path.join(dir, "FFMETADATAFILE.txt")
const chaptersPath = path.join(dir, "chapters.txt")

try {
  await $`ffmpeg -y -i ${assemblyOutputPath} -f ffmetadata ${metaPath}`
} catch (err) {
  // we don't care about the error, it's not a real error
}

const meta = []
const chapters = []

// inject title
meta.push("title=Hello World")
meta.push("artist=Vidr Team")
chapters.push("Hello Wolrd")
chapters.push("by Balena Vidr Team")

// inject chapters
let lastEnd = 0
for (const clip of orderedFiles) {
  const start = lastEnd
  const end = start + clip.duration
  meta.push(`[CHAPTER]`)
  meta.push(`TIMEBASE=1/1000`)
  meta.push(`START=${start * 1000}`)
  meta.push(`END=${end * 1000}`)
  meta.push(`title=${clip.folder}`)
  chapters.push(`${formatPosition(start)} - ${clip.folder}`)
  lastEnd = end
}

// push meta into files
for (const m of meta) { 
  await $`echo ${m} >> ${metaPath} && sleep 1`
}

for (const c of chapters) { 
  await $`echo ${c} >> ${chaptersPath} && sleep 1`
}

// reimport metadata
await $`ffmpeg -y -i ${assemblyOutputPath} -i ${metaPath} -map_metadata 1 -codec copy ${finalOutputPath}`
