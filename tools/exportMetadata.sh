#!/bin/bash
# https://ffmpeg.org/ffmpeg-formats.html#Metadata-1

# Extract the initial metadata (technical stuffs)
yes | ffmpeg -i output.mp4 -f ffmetadata FFMETADATAFILE.txt

# To construct the chapters we need to extract the length of each videos after trim, and their title.

# Here we set the main meta
echo "title=hello world" >> FFMETADATAFILE.txt
echo "artist=BMovie Team Test" >> FFMETADATAFILE.txt

# then we loop over the files to get the length and create chapters
# FIXME : find doesn't output the files in the right order, need some sorting
# FIXME : the Length is not right yet

# ffprobe -i 01-intro/intro.mp4 -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 

find . -type f -not -name '.*' -a \( -name "*.mp4" \) \
  -exec bash -c '\
  file=${1#./}; \
    LENGTH=`ffprobe -i $file -v quiet -show_entries format=duration -hide_banner -of default=noprint_wrappers=1:nokey=1 | cut -f 1 -d '.'`
    TITLE=`basename ${file}`
    if [[ -z "$LASTSTART" ]]; then 
      LASTSTART=0
    fi
    echo "$LENGTH"
    echo "$TITLE"
    echo "$LASTSTART"
    # echo "[CHAPTER]" >> FFMETADATAFILE.txt
    # echo "TIMEBASE=1/1000" >> FFMETADATAFILE.txt
    # echo "START=$(($LASTSTART))" >> FFMETADATAFILE.txt
    # echo "END=$(($LASTSTART+$LENGTH))" >> FFMETADATAFILE.txt
    # echo "title=${TITLE}" >> FFMETADATAFILE.txt
    LASTSTART=$(($LASTSTART+$LENGTH))
' _ '{}' \;

# Then we write back the new meta into the output
ffmpeg -i output.mp4 -i FFMETADATAFILE.txt -map_metadata 1 -codec copy output-meta.mp4