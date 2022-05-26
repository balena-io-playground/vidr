#!/bin/bash -e
set -o xtrace
#
# this script simply clones a repo, and moves all of its video files into /files/SRC
#

echo "* Cleaning /files/INPUT"
rm -rf /files/INPUT/*

echo "* Cloning source repo: ${SOURCE_GIT_URL}"
git clone --recursive $SOURCE_GIT_URL /tmp/SOURCE_GIT_REPO

echo "* Copying source to /files/INPUT"
mv /tmp/SOURCE_GIT_REPO/videos /files/INPUT

echo "* Cleaning source repo"
rm -rf /tmp/video_src/
