Linux Executable for FRET
=========================

Instructions
------------

1. In runfret.sh, set FRET_HOME to the absolute path of the unpacked FRET-linux-64 directory. Alternatively, set it directly in bashrc.
2. To run the FRET simulator, a NuSMV (see http://nusmv.fbk.eu/) installation is required. Please set NUSMV_HOME (in runfret.sh) to the absolute path of the Linux NuSMV binaries directory. Alternatively, set it directly in bashrc.
3. In a terminal:
  * chmod a+rx runfret.sh
  * ./runfret.sh


 ### Notes

> __Note:__ Step 2 is optional.
