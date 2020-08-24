FRET: Formal Requirements Elicitation Tool
=============================================

Introduction
------------

FRET is a framework for the elicitation, formalization and understanding of requirements. Users enter system requirements in a specialized natural language. FRET helps understanding and review of semantics by utilizing a variety of forms for each requirement: natural language description, formal mathematical logics, and diagrams. Requirements can be defined in a hierarchical fashion and can be exported in a variety of forms to be used by analysis tools.

Take a look at the [FRET demo](https://drive.google.com/open?id=142C-xIw6ar9rSgxz-wAXktYrTwAG0sKw).

Contact
-------

Please contact <fret@lists.nasa.gov> for further information on
FRET. Detailed information can be found at the [FRET manual](fret-electron/docs/userManual.md).

Installation
------------

### Dependencies

 * [nodejs](https://nodejs.org/en/about/) [recommended [v10.15.x](https://nodejs.org/download/release/v10.15.3/)]
 * Python 2.x
 * (Optional) [NuSMV](http://nusmv.fbk.eu/)

### Download and Install

As you open the FRET distribution, you shall see the following directory structure:

```
.
├── fret-electron
├── tools
├── README.md
└── LICENSE.pdf
```

Here are the steps to install and start FRET:

1. cd fret-electron
2. npm run fret-install (please do 'npm run fret-reinstall' instead if you already have a FRET installation)
3. npm start

It's as simple as that. Enjoy!

### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

> __Note:__ FRET requires **python 2.x**. If your machine is running a newer version of python, e.g., 3.x, then please config FRET to search for a python2 executable. Run the following: `npm config set python /usr/bin/python2.x`

> __Note:__ Compiling on Windows machines requires [Cygwin](https://cygwin.com/index.html) and the [node-gyp prerequisites](https://github.com/nodejs/node-gyp#on-windows).

>__Note:__ Recommended npm version 6.x (comes with nodejs v10.x)


Platforms
---------

FRET has been tested in a range of architecture/operating system combinations. It has been tested on PC Intel, Apple Mac and Sun architectures, with different versions and distributions of Linux, Windows and Mac OS X.

License
-------

FRET has been released under the NASA Open Source Agreement version 1.3, see [LICENSE.pdf](LICENSE.pdf).


Contributors
------------

See the FRET [Contributors](CONTRIBUTORS.md).
