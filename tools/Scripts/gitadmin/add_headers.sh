#!/bin/sh
# This is the file containing the .js and .g4 files in which the licence header will be updated.
export LIST_RAW="L_js_files.txt"

export FRET_HOME=../../../

	# available replacements:
	#	__FILE__
	#	__AUTHOR__

# The file disclaimer.txt below was used as a header before FRET v3.0.
# export LIC='disclaimer.txt'
export LIC='apache_2_0_header.txt'

WD=`pwd`

cd $FRET_HOME

for i in `cat $WD/$LIST_RAW` ; do
	echo "processing $i..."
	AUTHORS0=`git log $i | sed -e '/^Author:/!d' -e 's/ <.*$//' \
		-e 's/Author: //' \
		-e 's/^Giannakopoulou$/Dimitra Giannakopoulou/' \
		-e 's/^Anastasia$/Anastasia Mavridou/' \
		-e 's/^Mavridou$/Anastasia Mavridou/' \
		-e 's/^Schumann$/Johann Schumann/' \
		-e 's/^Johann$/Johann Schumann/' \
		-e 's/ /X/g' \
		| sort -tX -k 2  | uniq `;
	AUTHORS=`echo $AUTHORS0 | sed -e 's/ /, /g' -e 's/X/ /g'`;

	#For each source file, create a backup, then overwrite the source file with the new header.
	cp $i $i.bbak
	sed -e "s/__FILE__/`basename $i`/" \
	    -e "s/__AUTHOR__/$AUTHORS/" \
	    $WD/$LIC 	> $i

	# Check if the old file had a header. If yes, replace with the new header.
	# The grep command below is compatible with the header in disclaimer.txt, used before FRET v3.0
	# grep 'UNITED STATES GOVERNMENT' $i.bbak   >/dev/null
	grep 'United States Government' $i.bbak >/dev/null
	if [ $? = 0 ] ; then
		echo "removing old header..."
		# The sed commands below are compatible with the header in disclaimer.txt, used before FRET v3.0
		# sed -e '1,/UNILATERAL/d' $i.bbak | \
		# sed -e '1,/^..\\*\\*\\*\\*\\*\\*/d' >> $i

		#Remove the old header from the backup source file, then append the rest (should be pure source code) to the actual source file. This assumes that the old header contains the string 'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND' in its last line, and only there.
		sed -e '1,/WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND/d' $i.bbak >> $i
	else
		cat $i.bbak >> $i
	fi

	git add $i
	done


