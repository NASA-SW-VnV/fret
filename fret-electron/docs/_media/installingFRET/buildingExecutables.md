# Build executable with Docker Image

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
