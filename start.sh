#!/bin/bash -e

mkdir -p /files/OUTPUT
mkdir -p /files/INPUT

rm -rf /files/INPUT/* 
rm -rf /files/OUTPUT/*

/usr/src/tools/fetchGitSource.sh

cd /files/INPUT

/usr/src/tools/convertAndNormalize.sh

/usr/src/tools/meta.mjs

balena-idle
