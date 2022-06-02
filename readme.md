# vidr
Landr only for product videos!
Enable product builders to create beautiful videos by simply putting their raw content alongside their source code.
vidr will clean it up, trim it, overlay audio, add gorgeous captions and create a smash hit product video.

## The Problem
Recording videos on a phone, webcam or by screen capture is easy. Editing videos so that they don't look crap is HARD. Not to mention boring. Busy product builders don't have the time or energy (and sometimes skills or software) to make videos about all their products. 

## vidr == the solution
With vidr product builders can capture video content, and add it to the same github repository as any of their other product files. They can also add audio files, to add background music or a clean audio commentary, which will be overlaid on top of the clip. And they can also add some simple markdown files, with a naming convention, to tell vidr to perform operations on each clip.
All of the edited clips will then be joined together in the correct order, and a top notch product video produced.

# How do I use it?
## Record your video sections
Simply record the sections of your video and add them to a landr-style folder structure:
![Folder-structure](./docs/images/top-level-folder.png)

![Folder-structure](./docs/images/folder-sections.png)

## (Optional) Add audio files
Want some background music, or a clean voiceover explaining what's happening on the screen? Simply add the audio file next to the clip, and vidr will make it so:

![audio](./docs/images/audio.png)

For instance a 'caption.md' file will cause the text in that file to be overlaid on top of the clip, in a beautiful dynamic caption.

## (Optional) Add captions
Want some text overlaid on top of a clip, to make a cool segway scene? Sure, just add a `caption.md` file:

![caption](./docs/images/caption.png)

and vidr will do the rest!

https://user-images.githubusercontent.com/39430324/167104079-b9d332b4-c7db-45dd-a6d2-17aa4a829960.mp4

## (Optional) Trim your clip
So, we're not all trained TV presenters, so our clips might be a bit waffly. Don't worry, vidr's gotchu!
Just add a `trim.md` file and put the start and end time for the clip, and it'll be trimmed. Magic!

![trim](./docs/images/trim.png)

# Technical usage

You will need to specify at least one environment variable, which is `SOURCE_GIT_URL`. This should be a publicly accessible git repository that has a `videos` directory, which houses all your content.

You can also specify `SOURCE_GIT_BRANCH` if you want vidr to use a specific branch on your repository as well.

# What does vidr produce?
vidr runs as a transformer. It will take in all your videos, audio and markdown files, clean them up (level the audio, make the videos the same resolution and format), trim them, generate and overlay captions, overlay your audio, join them all together into a single clip, make YouTube compatible chapters AND generate a nice video intro and outro using the github repo name and contributors.

Here's the vidr product video explaining it all, generated with vidr itself.
Dogfooding FTW!

[final video goes here]
