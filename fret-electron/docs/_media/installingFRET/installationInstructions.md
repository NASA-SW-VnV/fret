# Installing and running FRET

### Dependencies

 * [NodeJS](https://nodejs.org/en/download/) (use any version between v16.16.x - v20.13.1)
 * Python (use any version between v2.7.x - v3.11.x)
 * `gcc`, `g++`, `make`
 * (Optional) [NuSMV](http://nusmv.fbk.eu/)
 * (Optional) [JKind](https://github.com/andrewkatis/jkind-1/releases/latest)
 * (Optional) [Kind 2](https://github.com/kind2-mc/kind2/blob/develop/README.rst)
 * (Optional) [Z3](https://github.com/Z3Prover/z3/releases)

### Install and Run

When you open the FRET distribution, you will see the following directory structure:

```
.
├── fret-electron
├── tools
├── caseStudies
├── CONTRIBUTORS.md
├── LICENSE.pdf
└── README.md
```

* Here are the steps to install and run FRET on Linux and MacOS systems:

  1. cd fret-electron
  2. npm run fret-install (please do 'npm run fret-reinstall' instead if you already have a FRET installation)
  3. npm start


* Alternatively, for MacOS or Linux users, we provide means to build an executable natively or through Docker. See [Building executables](buildingExecutables.md).

* For the installation of FRET on Windows see our [Windows installation guide](installation_windows.md).

* If you run into installation issues, check the [Troubleshooting](Troubleshooting.md) section.

* FRET developers, check the [Developer's guide](../developersGuide/installingAndRunningFRET.md).

### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

> __Note:__ To perform realizability checking, additional dependencies must be installed. Read the realizability checking [Dependencies](../exports/realizabilityManual.md) section for details.

> __Note:__ You can config FRET to specify which version of python to use. For example, to use python3 executable, run the following: `npm config set python /usr/bin/python3.x`


[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
