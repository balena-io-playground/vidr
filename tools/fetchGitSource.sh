#!/bin/bash -e
#
# this script simply clones a repo, and moves all of its video files into /files/SRC
#

echo "* Removing /files/INPUT"
rm -rf /files/INPUT && mkdir -p /files/INPUT;
rm -rf /tmp/SOURCE_GIT_REPO;

echo "* Cloning source repo: ${SOURCE_GIT_URL}"
git clone --recursive $SOURCE_GIT_URL /tmp/SOURCE_GIT_REPO;

if [ -z "$SOURCE_GIT_BRANCH" ]
then
    echo "* No branch selected, using default";
else
    echo "* Checking out branch: ${SOURCE_GIT_BRANCH}"
    pushd /tmp/SOURCE_GIT_REPO;
    git checkout $SOURCE_GIT_BRANCH;
    popd;
fi

echo "* Copying source to /files/INPUT";
mv /tmp/SOURCE_GIT_REPO/videos/* /files/INPUT;

echo "* Removing white space in file names";
find /files/INPUT -depth -name "* *" -execdir rename 's/ /_/g' "{}" \;

echo "* Cleaning source repo";
rm -rf /tmp/SOURCE_GIT_REPO;
