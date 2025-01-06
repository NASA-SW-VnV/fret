# File author: Ivan Dominguez Perez 
FROM ubuntu:latest

# Avoid questions during the installation of packages.
ENV DEBIAN_FRONTEND=noninteractive

# We set the time-zone so that tzdata does not ask for it during installation.
ENV TZ="America/Los_Angeles"

RUN apt-get --yes update

# Tools needed to install node
RUN apt-get --yes install wget

# Tools needed to compile FRET
RUN apt-get --yes --no-install-recommends install make gcc g++ git python3

# Dependencies needed to run FRET (Ubuntu 24.04 or greater)
RUN apt-get --yes --no-install-recommends install libgtk-3-0t64 libdrm2 libgbm1 libnss3 libx11-xcb1 libasound2t64

# Dependencies needed to run FRET (Ubuntu versions older than 24.04)
# RUN apt-get --yes --no-install-recommends install libgtk-3.0 libdrm2 libgbm1 libnss3 libx11-xcb1 libasound2

# Running electron as root requires --no-sandbox, which we can't pass easily,
# so we create a separate user to compile and package FRET.
RUN mkdir /home/fret
RUN groupadd fret
RUN useradd -d /home/fret -g fret fret
RUN chown -R fret:fret /home/fret

USER fret

# Install node locally. Works better permission-wise.
RUN wget --inet4-only https://nodejs.org/download/release/v16.16.0/node-v16.16.0-linux-x64.tar.gz -O /tmp/node-v16.16.0-linux-x64.tar.gz
WORKDIR /home/fret
RUN tar -zxvpf /tmp/node-v16.16.0-linux-x64.tar.gz
ENV PATH=/home/fret/node-v16.16.0-linux-x64/bin:$PATH

# Add local copy of files
ADD . /home/fret/fret
WORKDIR /home/fret/fret/fret-electron
USER root
RUN chown -R fret:fret /home/fret/fret
USER fret

# Check to see if npm is picked up
RUN npm --version
RUN npm install --location=global electron-packager

# Check to see if electron-packager is picked up
RUN electron-packager --version

# Package the application
WORKDIR /home/fret/fret/fret-electron
RUN mkdir /home/fret/Desktop
RUN /home/fret/fret/generate_executable_Linux.sh

CMD /bin/bash
