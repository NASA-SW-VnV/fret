# Installing FRET

### Dependencies

 * [NodeJS](https://nodejs.org/en/download/) (use any version between v15.14.x - v16.16.x)
 * Python (Version >=2. Note: if you are having issues using 3.11 or later, use 3.10) 
 * (Optional) [NuSMV](http://nusmv.fbk.eu/)
 * (Optional) [JKind](https://github.com/andrewkatis/jkind-1/releases/latest)
 * (Optional) [Kind 2](https://github.com/kind2-mc/kind2/blob/develop/README.rst)
 * (Optional) [Z3](https://github.com/Z3Prover/z3/releases)

### Download and Install

When you open the FRET distribution, you will see the following directory structure:

```
.
├── fret-electron
├── tools
├── tutorialExamples
├── CONTRIBUTORS.md
├── LICENSE.pdf
└── README.md
```

Here are the steps to install and start FRET:

1. cd fret-electron
2. npm run fret-install (please do 'npm run fret-reinstall' instead if you already have a FRET installation)
3. npm start

For the installation of FRET on Windows 10 see [Installation_Windows](installation_windows.md).

For the installation of FRET on Apple M1 machines see notes below.


### Build executable with Docker Image

Alternatively, for Linux users, we provide a [Docker image](../../../../tools/Scripts/docker) to build an executable binary. Here are the steps:

1. cd fret
2. mv fret/tools/Scripts/docker/Dockerfile .
3. mv fret/tools/Scripts/docker/generate_executable_Linux.sh .
4. docker build -t fret-install -f Dockerfile .
5. mkdir ../fret-desktop (Replace path with your preference)
6. docker run -v $PWD/../fret-desktop:/tmp/fret -u root -it fret-install:latest /bin/bash
7. cp ~fret/Desktop/FRET-linux-x64.tgz /tmp/fret/
8. cd ../fret-desktop
9. tar -xzvf FRET-linux-x64.tgz
10. cd FRET-linux-x64
11. ./FRET

### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

> __Note:__ To perform realizability checking, additional dependencies must be installed (e.g., JKind or Kind2). Read the realizability checking [Dependencies](../exports/realizabilityManual.md) section for details.

> __Note:__ FRET can run with either **python 2.x** or **python 3.x**. You can config FRET to specify which version of python to use. For example, to use python2 executable, run the following: `npm config set python /usr/bin/python2.x`

> __Note:__ Compiling on Windows machines requires  **gcc** and the [node-gyp prerequisites](https://github.com/nodejs/node-gyp#on-windows).

> __Note:__ For M1 architectures please follow the following steps after cloning FRET:
1. cd fret/fret-electron
2. npm run fret-install
4. cd app (under fret/fret-electron/)
5. npm install leveldown@latest
6. Edit package-lock.json (under fret/fret-electron/app/)
- Change leveldown dependency: “^5.4.0” under node_modules/level to “^6.0.3”
- Change leveldown dependency: “5.6.0” under node_modules/pouchdb to “^6.0.3”
7. cd ..
8. npm start

> __Note:__ If you encounter GPU-related issues on Ubuntu 22.04 LTS, here is a workaround (see also [here]( https://github.com/NASA-SW-VnV/fret/issues/46)):
1. cd fret/fret-electron
2. Open package.json in an editor
3. Find the "scripts" object, change the value of the "start" key from "cross-env NODE_ENV=production electron ./app/" to "cross-env NODE_ENV=production electron --no-sandbox ./app/"
4. Save and exit the editor
5. npm start

> __Note:__ If you encounter glibc-related issues when using the executable built by the Docker image, try the following steps:
1. Open the "Dockerfile" file in an editor (this file should be in the "fret" root folder if you already attempted to build a binary)
2. Change "FROM ubuntu:latest" to "FROM ubuntu:focal"
3. Try again the Docker instructions, starting with step 4.

[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
