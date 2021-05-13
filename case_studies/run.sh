# find . -name "FCC*.lus" -print -exec jrealizability -timeout 86400 {} \;

rm kind.txt
rm fixpoint.txt
for f in $(find . -name "*.lus"); do 
	echo $f
	echo $f >> kind.txt;
	echo $f >> fixpoint.txt;
	jrealizability -timeout 300 $f | grep "Time" >> kind.txt;
	jrealizability -fixpoint -timeout 300 $f | grep "Time" >> fixpoint.txt;
done


