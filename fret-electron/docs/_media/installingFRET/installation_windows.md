# Installing FRET on Windows

For Windows, we recommend using the [Windows Subsystem for Linux (WSL)](#windows-subsystem-for-linux-wsl).

## Windows Subsystem for Linux (WSL)

### Prerequisites

**FRET can only be used with WSL 2**. A full official Microsoft guide to installing WSL 2 can be found [here](https://learn.microsoft.com/en-us/windows/wsl/install). New Linux installations are set to WSL 2 by default. If you want to install FRET on an existing Linux distribution, make sure to check that it is set to WSL 2. For more details on how to check and upgrade from WSL 1 to WSL 2, follow this [guide](https://learn.microsoft.com/en-us/windows/wsl/install#upgrade-version-from-wsl-1-to-wsl-2).

We have succesfully installed FRET in Ubuntu distributions using the official Microsoft guide above. **The rest of this guide assumes that an Ubuntu WSL installation is used.** For most users, a full WSL Ubuntu installation can be performed by running the following command in a Windows Powershell or Command Prompt terminal:

```
wsl --install
```

If you wish to use a different distribution, but encounter issues with the current guide, please contact us or create a Github Issue ticket.

After WSL and an Ubuntu distribution have been installed, open the WSL terminal (you can search for "wsl" using Windows' standard search functionality) to access the Ubuntu distribution. You can then proceed to install the required dependencies, mentioned in [the first page of our installation guide](installationInstructions.md#dependencies), using standard Ubuntu package installation commands (e.g. `sudo apt install gcc`). Please note that this step needs to be performed from within the Ubuntu distribution. **It is not necessary to install the Windows versions of these dependencies**.

Since this is a clean Ubuntu installation, it may be the case that `git` is not an available command. Install it via:

```
sudo apt install git
```

FRET currently assumes the existence of a `Documents` folder in the home directory, which may not exist in your Ubuntu installation. If the folder does not exist, create it by running the command:

```
mkdir ~/Documents
```

Since FRET's main functionalities are provided via its Graphical User Interface (GUI), it is necessary to ensure that appropriate **Windows** graphics software drivers have been installed. For further details, consult this Microsoft [guide](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps). If you encounter GUI-related issues, you may need to update your graphics drivers or WSL installation to the latest possible version. Otherwise, consult this [Github Issue thread](https://github.com/microsoft/wslg/issues/1148) for further insights.

After all the required dependencies have been installed, clone the FRET repository using `git` to a directory of your choosing, and proceed with the standard installation steps:

```
git clone https://github.com/NASA-SW-VnV/fret.git
cd fret/fret-electron
npm run fret-install
```
Finally, run FRET:

```
npm start #(or npm start --no-sandbox, if you encounter issues with Ubuntu 22.04 LTS or later)
```

To install optional dependencies ( [NuSMV](http://nusmv.fbk.eu/),
 [JKind](https://github.com/andrewkatis/jkind-1/releases/latest),
 [Kind 2](https://github.com/kind2-mc/kind2/blob/develop/README.rst),
 [Z3](https://github.com/Z3Prover/z3/releases) ), do so using their **Linux** binaries. From within the WSL Ubuntu distribution, download the respective binary to a folder of your choice and make it accessible by adding its full path to the distribution's PATH environment variable. For further details, consult our [Notes](installationInstructions.md#notes) section.


[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)