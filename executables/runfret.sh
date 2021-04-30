
echo "running pre-compiled FRET"

# Uncomment the line below and add the absolute path of the unpacked FRET-linux-64 directory. E.g., FRET_HOME=<path_to_FRET>
# FRET_HOME=

# Optionally, uncomment the line below and add the absolute path to the Linux NuSMV binaries directory. E.g., NuSMV_HOME=<path_to_NUSMV>
# NUSMV_HOME=


export PATH=$PATH:$NUSMV_HOME:$FRET_HOME:$FRET_HOME/resources/app/tools/LTLSIM/ltlsim-core/simulator/

$FRET_HOME/FRET
