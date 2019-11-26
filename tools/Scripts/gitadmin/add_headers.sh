
export LIST_RAW="L_js_files.txt"

export FRET_HOME=../../../

	# available replacements:
	#	__FILE__
	#	__AUTHOR__
export LIC='disclaimer.txt'

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


	cp $i $i.bbak
	sed -e "s/__FILE__/`basename $i`/" \
	    -e "s/__AUTHOR__/$AUTHORS/" \
	    $WD/$LIC 	> $i

	grep 'UNITED STATES GOVERNMENT' $i.bbak   >/dev/null
	if [ $? = 0 ] ; then
		echo "removing old header..."
		sed -e '1,/UNILATERAL/d' $i.bbak | \
		sed -e '1,/^..\\*\\*\\*\\*\\*\\*/d' >> $i
	else
		cat $i.bbak >> $i
	fi

	git add $i
	done


