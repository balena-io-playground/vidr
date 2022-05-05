#!/bin/bash

mkdir /files/OUTPUT
mkdir /files/INPUT

rm -rf /file/OUTPUT/*

cp -rf /usr/src/videos /files/INPUT/

cd /files/INPUT
/usr/src/tools/convertAndNormalize.sh

/usr/src/tools/meta.mjs

balena-idle