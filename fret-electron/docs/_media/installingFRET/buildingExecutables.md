# Build FRET executable binary (MacOS/Linux only) 

We provide the following options:

1. For Linux, build the executable [natively](#build-natively-using-provided-script) or using the provided [Docker image](#build-executable-with-docker-image-linux-only).
2. For MacOS, build the executable [natively](#build-natively-using-provided-script).

## Build natively using provided script

MacOS and Linux users have the option of building an executable binary for FRET using the scripts that we provide [here](../../../../tools/Scripts/FRETExecutables/). 

The default behavior of these scripts builds an executable by cloning the most recent version of FRET from GitHub under '/tmp/FRET_PACK/'. The result of running the script is a compressed file containing the executable under `~/Desktop/FRET-{darwin-x64/linux-x64}.tgz`. See the scripts' contents for further details and to make further adjustments to their behavior.

To build an executable, follow the steps below:

1. Install the required (and optional) [dependencies](./installationInstructions.md#dependencies).
2. Open a command line application. Make sure that the npm `electron-packager` has been installed on your environment. To do so, run (may need root permissions) 

    ```
    npm install -g electron-packager
    ```
3. Make sure that the script that corresponds to your operating system has permissions to read, write and execute commands in your environment.
4. Change directory to the folder containing the scripts. For example, from FRET's home directory (`fret`), run
    ```
    cd tools/Scripts/FRETExecutables/
    ```
5. Run the script. For example, for Linux run
    ```
    ./generate_executable_Linux.sh
    ```
6. If the FRET interface pops up during the building process, close the window to allow the process to continue.
7. When building is done, a compressed file will be under the `Desktop` folder. For example, for Linux, users will have a file called `FRET-linux-x64.tgz`.
8. Decompress the file. For example, for Linux run
    ```
    tar -xzvf FRET-linux-x64.tgz
    ```
9. Change directory to the folder where the contents of the compressed file were stored and run the FRET executable. Continuing the example from step 8, run
    ```
    cd FRET-linux-x64
    ./FRET
    ```

> [!NOTE]
> Due to an electron issue, the built executable for Linux may not be possible to run from the Linux Graphical User Interface or File Explorer (i.e. by double-clicking the executable icon). A workaround, that creates a desktop launcher and adds the executable to the list of available applications is provided below.

1. Create a launcher file called `FRET.desktop` under `/home/your_username/.local/share/applications`.
2. Add the following contents to `FRET.desktop`. Make sure that you replace the value for `Exec` to the full path to the FRET executable.
    ```    
    [Desktop Entry]
    Name=FRET
    Exec= <full path to FRET executable goes here, for example /home/>
    Terminal=false
    Type=Application
    StartupNotify=true
    Encoding=UTF-8
    ```
3. The FRET application should now be in Ubuntu's Applications menu (you should also be able to search for "FRET"). Clicking on the application icon should launch FRET.

## Build executable with Docker Image (Linux only)

For Linux users, we provide a [Docker image](../../../../tools/Scripts/docker) to build an executable binary. Here are the steps:

1. `cd fret`
2. `mv tools/Scripts/docker/Dockerfile .`
3. `mv tools/Scripts/docker/generate_executable_Linux.sh .`
4. `docker build -t fret-install -f Dockerfile .`
5. `mkdir ../fret-desktop (Replace path with your preference)`
6. `docker run -v $PWD/../fret-desktop:/tmp/fret -u root -it fret-install:latest /bin/bash`
7. `cp ~fret/Desktop/FRET-linux-x64.tgz /tmp/fret/`
8. `exit` (to exit the docker image)
9. `cd ../fret-desktop`
10. `tar -xzvf FRET-linux-x64.tgz`
11. `cd FRET-linux-x64`
12. `./FRET` (or `./FRET --no-sandbox` if the application doesn't load)
    * (Optional) We provide a script [template](../../../../tools/Scripts/runfret.sh) that runs FRET given temporary, predefined environment variables for the application and any optional dependencies (an example for NuSMV is given). Please note that, before using the script for the first time, you need to edit its contents to provide appropriate path values to the environment variables. See the file for further details.
