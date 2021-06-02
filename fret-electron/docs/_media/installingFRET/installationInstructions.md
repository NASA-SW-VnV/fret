# Installing FRET

### Dependencies

 * [nodejs](https://nodejs.org/en/download/) [recommended v10.15.x]
 * Python 2.x
 * (Optional) [NuSMV](http://nusmv.fbk.eu/)

### Download and Install

As you open the FRET distribution, you shall see the following directory structure:

```
.
├── fret-electron
├── tools
├── CONTRIBUTORS.md
├── FRETDemo.md
├── LICENSE.pdf
└── README.md
```

Here are the steps to install and start FRET:

1. cd fret-electron
2. npm run fret-install (please do 'npm run fret-reinstall' instead if you already have a FRET installation)
3. npm start

It's as simple as that. Enjoy!

### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

> __Note:__ FRET requires **python 2.x**. If your machine is running a newer version of python, e.g., 3.x, then please config FRET to search for a python2 executable. Run the following: `npm config set python /usr/bin/python2.x`

> __Note:__ Compiling on Windows machines requires  **gcc** and the [node-gyp prerequisites](https://github.com/nodejs/node-gyp#on-windows).

>__Note:__ Recommended npm version 6.x (comes with nodejs v10.x)

[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
