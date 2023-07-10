# Installing FRET on Windows

These installation instructions describe the installation of FRET
natively under Windows 10/11.

## Prerequisites

The following software packages must be installed.

* install git.
  Git is available from https://git-scm.com/download/win

* install python 2.7 from https://www.python.org/downloads/release/python-2718/

  * Note: The installation of npm requires that python2.7 is installed as a windows package. A python installation under cygwin does not seem to be working


* install the node version manager. This step allows the user to have more than one version of nodejs running on the machine. This feature might be helpful, since FRET requires certain versions of nodejs.
To do so, follow the Microsoft tutorial at https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows

* install the nvm-setup from https://github.com/coreybutler/nvm-windows/releases. Download the repo as a .zip file, unpack, and install

## Test the nvm Installation

In a powershell, issue `nvm ls`. Unless you already have a version of nodejs installed under windows, no output should be produced.

Type `nvm list available` to show, which nodejs versions are available.
For FRET, we suggest to install 10.15.0.
This can be accomplished by `nvm install 10.15.0`.
After the installation, the `nvm ls` should list the installed version:

<img src="../screen_shots/nvm_installed_nodejs.png">

Make sure that you select the version 10.15.X as the currently active one.

Additionally, you should set nvm's default version of Python to Python 2.7.

If Python 2.7 is on your system PATH, you can set it with:

`npm config set python python2.7`

If not, then use one of these commands (if your installation of Python 2 is in a different directory, be sure to link to that one):  
```
//for Windows
npm config set python C:\Python27\python.exe
//for Linux
npm config set python /usr/bin/python27`
```

If you still get Python-related errors after this, you may need to go as far as setting your system's default to Python 2.7, and/or removing Python 3 from the system PATH.

## Download FRET

Make a directory where the FRET sources should reside and clone the
FRET repository
```
mkdir FRET
cd FRET
git clone https://github.com/NASA-SW-VnV/fret.git
cd .\fret\fret-electron
```

## Install the node-windows-build tools

On an adminitrator powershell execute

```npm install --global windows-build-tools```

## Install cygwin

A cygwin installation is currently needed to provide the `gcc` C compiler.

From (https://cygwin.com/install.html) download the `setup-x86_64.exe`.
Execute this binary.
In the GUI select the default selection and manually add the following
packages

* make
* gcc-core

These packages can be best selected using the search function in the selection window. Then continue the installation.
This installation should produce an icon for cygwin terminal on the Desktop.

## Test for make and gcc

Start the cygwin terminal and type `make`.
It should respond with an error like
`No targets specified and no makefile found`.
If `command not found` is shown, make has not been installed properly.

Similarly, type `gcc` in the terminal.
It should respond with `gcc: fatal error: no input files`.
If `command not found` is shown, the C compiler has not been installed properly.

<img src="../screen_shots/cygwin_test_prerequisites.png">

## Install FRET

In the cygwin terminal, go into the FRET directory. Since the FRET 
directory is under the Windows Users directory, the command is
`cd /cygdrive/c/Users/USERNAME/fret/fret-electron`

Type `npm run fret-install` for a fresh installation of FRET or
`npm run fret-reinstall` if there is already an existing (working or
failed) installation of FRET

Finally, type `npm start` to launch FRET, or `npm run dev` to launch with the developer console.


<img src="../screen_shots/fret-on-windows.png">


Notes:
* if FRET fails to start up after a seemingly successful installation,
do a `npm run fret-reinstall`.

## Install NuSMV 

The NuSMV model checker is necessary to run the LTL-simulator.

```TO-BE-DONE```
