#!/bin/sh

export LIST_RAW="L_js_files.txt"

export FRET_HOME=../../../

(cd $FRET_HOME; find . -name '*.js' -o -name '*.g4' ) | \
	sed -e '/node_modules/d' \
	    -e '/flow-typed/d' \
	    -e '/dll\.js/d' \
	    -e '/prod\.js/d' \
	    -e '/configs/d' \
			 >$LIST_RAW


