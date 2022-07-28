# Installing FRET

### Dependencies

 * [NodeJS](https://nodejs.org/en/download/) (use any version between v15.14.x - v16.16.x)
 * Python 2.x, 3.x
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


### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

> __Note:__ To perform realizability checking, additional dependencies must be installed (e.g., JKind or Kind2). Read the realizability checking [Dependencies](../exports/realizabilityManual.md) section for details.

> __Note:__ FRET can run with both **python 2.x** and **python 3.x**. You can config FRET to specify which version of python to use. For example, to use python2 executable, run the following: `npm config set python /usr/bin/python2.x`

> __Note:__ Compiling on Windows machines requires  **gcc** and the [node-gyp prerequisites](https://github.com/nodejs/node-gyp#on-windows).

[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
