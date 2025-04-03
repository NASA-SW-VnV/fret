# Installing and running FRET

### Dependencies

 * NodeJS (use any version between v16.16.x - v20.19.x, see instructions [here](#How-to-install-NodeJS))
 * Python (use any version between v3.10.x - v3.13.x)
 * `gcc`, `g++`, `make`
 * Ubuntu users, ensure that the following packages are installed:
     - Ubuntu 24.04 or later: `libgtk-3-0t64 libdrm2 libgbm1 libnss3 libx11-xcb1 libasound2t64`
     - Older than Ubuntu 24.04: `libgtk-3.0 libdrm2 libgbm1 libnss3 libx11-xcb1 libasound2`
 * (Optional) [NuSMV](http://nusmv.fbk.eu/)
 * (Optional) [JKind](https://github.com/andrewkatis/jkind-1/releases/latest)
 * (Optional) [Kind 2](https://github.com/kind2-mc/kind2/blob/develop/README.rst)
 * (Optional) [Z3](https://github.com/Z3Prover/z3/releases)

### Install and Run

* Here are the four simple steps to install and run FRET on Linux and MacOS systems:

  1. `git clone https://github.com/NASA-SW-VnV/fret.git`
  2. `cd fret/fret-electron`
  3. `npm run fret-install`
  4. `npm start`


* Alternatively, for MacOS or Linux users, we provide means to build an executable natively or through Docker. See [Building executables](buildingExecutables.md).

* For the installation of FRET on Windows see our [Windows installation guide](installation_windows.md).

* If you run into installation issues, check the [Troubleshooting](Troubleshooting.md) section.

* FRET developers, check the [Developer's guide](../developersGuide/installingAndRunningFRET.md).

### Notes

> __Note:__ To run the LTLSIM simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please make sure that the NuSMV binaries directory is added to the PATH environment variable. Additionally, please add `$PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable. Note that $PATH_TO_FRET  is the path location where the FRET git repo was cloned (and not the path to the FRET binary).

> __Note:__ To perform realizability checking, additional dependencies must be installed. Read the realizability checking [Dependencies](../exports/realizabilityManual.md) section for details.

> __Note:__ To generate test cases or test obligations, a NuSMV (see http://nusmv.fbk.eu/) installation is required.

### How to install NodeJS

The easiest official way is through the node version manager (nvm):
```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 20

# Verify the Node.js version:
node -v # Should print "v20.19.0".
nvm current # Should print "v20.19.0".

# Verify npm version:
npm -v # Should print "10.8.2".
```

> __Note:__ Since different projects might require different node versions, nvm (or fnm) provide an easy way to switch between previously installed node versions, e.g., by `nvm use vA.B.C`. 

Here is the [NodeJS website](https://nodejs.org/en). If you download a NodeJS prebuild, please make sure that it is in the `v16.16.x - v20.19.x` version interval.


[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
