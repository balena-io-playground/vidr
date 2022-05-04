#!/bin/bash
# Convert and normalize audio and video files

# Build for transformers
# Assumes the INPUT and OUPUT folders already exists
# Assumes the script is launched inside the INPUT folder

# Will replicate INPUT structure and files into OUPUT than normalize the OUPUT files in place

cp -rf . ../OUTPUT/
cd ../OUTPUT

# Find all .MOV .mov .mp4 .MP4 files (excluding hidden files) in the subfolders and convert them to
# TODO: Need to do some conversion for vertical video
# Then -> turn into : mp4 / h264 / 720p30 / aac / loudness normalized

find . -type f -not -name '.*' -a \( -name "*.MOV" -o -name "*.mov" -name "*.AVI" -o -name "*.avi" -o -name "*.mp4" -o -name "*.MP4" \) \
       -exec bash -c '\
        file=${1#./}; \
          rm $file &&
          yes | ffmpeg -i ../INPUT/$file -vf "fps=30,scale=1280:720" -af loudnorm -c:v libx264 -c:a aac ./`echo $file | cut -f 1 -d '.'`.mp4 \
      ' _ '{}' \;

# Find all .MP3 .mp3 .AAC .aac .WAV .wav and turn them into aac / loudness normalized
find . -type f -not -name '.*' -a \( -name "*.MP3" -o -name "*.mp3" -o -name "*.AAC" -o -name "*.aac" -o -name "*.WAV" -o -name "*.wav" \) \
       -exec bash -c '\
        file=${1#./}; \
          yes | ffmpeg -i ./$file -af loudnorm -c:v h264 -c:a aac ./`echo $file | cut -f 1 -d '.'`.aac \
      ' _ '{}' \;