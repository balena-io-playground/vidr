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
# Then -> turn into : mp4 / h264 / 1080p30 / aac / loudness normalized

find . -type f -not -name '.*' -a \( -name "*.MOV" -o -name "*.mov" -name "*.mkv" -o -name "*.MKV" -name "*.wmv" -o -name "*.WMV" -name "*.webm" -o -name "*.WEBM" -name "*.AVI" -o -name "*.avi" -o -name "*.m4v" -o -name "*.M4V" -o -name "*.mp4" -o -name "*.MP4" \) \
       -exec bash -c '\
        file=${1#./}; \
          rm $file && echo "* Processing File: ${file}" && 
          yes | ffmpeg -i ../INPUT/$file -vf "yadif,format=yuv420p,fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black" -af loudnorm -c:v libx264 -crf 18 -bf 2 -c:a aac -q:a 1 -ac 2 -ar 48000 -use_editlist 0 -movflags +faststart ./`echo $file | cut -f 1 -d '.'`.mp4 \
      ' _ '{}' \;

# Find all .MP3 .mp3 .AAC .aac .WAV .wav .M4A .m4a and turn them into aac / loudness normalized
find . -type f -not -name '.*' -a \( -name "*.MP3" -o -name "*.mp3" -o -name "*.AAC" -o -name "*.aac" -o -name "*.WAV" -o -name "*.wav" -o -name "*.m4a" -o -name "*.M4A" \) \
       -exec bash -c '\
        file=${1#./}; \
          rm $file &&
          yes | ffmpeg -i ../INPUT/$file -af loudnorm -c:a aac -q:a 1 -ac 2 -ar 48000  ./`echo $file | cut -f 1 -d '.'`.aac \
      ' _ '{}' \;
