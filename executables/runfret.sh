
echo "running pre-compiled FRET"

FRET_HOME=

NUSMV_HOME=


export PATH=$PATH:$NUSMV_HOME:$FRET_HOME:$FRET_HOME/resources/app/tools/LTLSIM/ltlsim-core/simulator/

$FRET_HOME/FRET
