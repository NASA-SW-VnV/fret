Installing SALT
=========
These instructions are for Mac OS.

1. Download and install the Core Haskell platform from https://www.haskell.org/platform .  In what follows, the path to your ghc Haskell binary will be called *Haskell_Home*. After you do the install you can do `$ which ghc` which should show the path to the ghc binary.

2. Download the SALT zip from http://www.isp.uni-luebeck.de/software/Salt/Downloads/salt-src.zip
Create a folder to contain SALT (*SALT_Home*), and unzip into that folder:

    - `$ cd` *SALT_Home*
    - `$ unzip` *path_to_zip*/salt-src.zip

  Define a shell variable SALT_HOME, e.g. for sh

    - `$ export SALT_HOME`=*SALT_Home*

3. You'll need to edit some of the SALT code to get it to work with Haskell. 

    1. Edit these files in the *SALT_Home*/hs/ folder:

        - Replace `import Maybe` by `import Data.Maybe` in SALT2RLTL.hs PropositionCheck.hs
        - Replace `import List` by `import Data.List` in PropositionCheck.hs LTL2SMV.hs Helper.hs
        - Replace `import IO` by `import System.IO` in Helper.hs

    2. Change occurrences of `$@` to `"$@"` in *SALT_Home*/salt.sh.  
Make salt.sh executable: `$ chmod ugo+x salt.sh`

4. Copy *SALT_Home*/config/hs.properties.template to a new configuration file named *SALT_Home*/config/hs.properties . Edit some of its properties:

    - hs.interpreter = ghc
    - hs.tempfile = /tmp/salt_temp.hs
    - ghc.path = *Haskell_Home*
    - ghc.command = ghc

5. Build SALT:
    - `$ cd $SALT_HOME`  
    - `$ ant`

    This should say "BUILD SUCCESSFUL" at the end.

6. Try it:
    - `$ cd $SALT_HOME`
    - `$ ./salt.sh -f "assert always a"`

        [13 of 13] Compiling Main             ( /tmp/salt_temp.hs, /tmp/salt_temp.o )  
        Linking /tmp/salt_temp ...

    - `$ /tmp/salt_temp`
	
        LTLSPEC G a
