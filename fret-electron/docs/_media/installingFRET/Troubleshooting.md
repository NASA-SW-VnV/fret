# Troubleshooting

This document covers some common installation issues with FRET, and how to solve them.

Installation issues
-----------------------

### "Untracked working tree files error"
We have added package-lock.json files, as recommended by nodeJS, to assist the installation of FRET. These files were previously untracked (prior to release 3.1). If you get an "untracked working tree files error" when pulling the new code, please delete your local package-lock.json files.

### GPU-related issues on Ubuntu 22.04 LTS
If you encounter GPU-related issues on Ubuntu 22.04 LTS, here is a workaround (see also [here]( https://github.com/NASA-SW-VnV/fret/issues/46)):
1. cd fret/fret-electron
2. Open package.json in an editor
3. Find the "scripts" object, change the value of the "start" key from "cross-env NODE_ENV=production electron ./app/" to "cross-env NODE_ENV=production electron --no-sandbox ./app/"
4. Save and exit the editor
5. npm start

### glibc-related issues when using Docker image
If you encounter glibc-related issues when using the executable built by the Docker image, try the following steps:
1. Open the "Dockerfile" file in an editor (this file should be in the "fret" root folder if you already attempted to build a binary)
2. Change "FROM ubuntu:latest" to "FROM ubuntu:focal"
3. Try again the Docker instructions, starting with step 4.
