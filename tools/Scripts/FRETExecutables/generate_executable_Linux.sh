cd /tmp
mkdir FRET_PACK
cd FRET_PACK
# git clone  https://github.com/NASA-SW-VnV/fret.git

git clone https://babelfish.arc.nasa.gov/git/fret
cd fret

##Set the branch that you want to package, e.g.,:
#git checkout realizability

cd fret-electron
mv docs app
mv ../tools app

#analysis folder has been introduced with the realizability branch. Check if it exists.
if [ -d "analysis" ]; then
	mv analysis app;
fi

cd app;
mv components/Grammar.js x.js;
sed -e 's+Page from '\''\.\./\.\./docs/_media+Page from '\''../docs/_media+' x.js >components/Grammar.js;
rm x.js;
mv components/Instructions.js x.js;
sed -e 's+\.\./docs/+docs/+' x.js > components/Instructions.js;
rm x.js;
mv components/SlateEditor2.js x.js; 
sed -e 's+\.\./docs/+docs/+' x.js > components/SlateEditor2.js;
rm x.js;

FILERC=components/RealizabilityContent.js;
if test -f "$FILERC"; then
 mv components/RealizabilityContent.js x.js;
 sed -e 's+\.\./\.\./analysis/+analysis/+' x.js > components/RealizabilityContent.js;
 mv components/RealizabilityContent.js x.js;
 sed -e 's+analysis/tmp/+app/analysis/tmp/+' x.js > components/RealizabilityContent.js;
 rm x.js;
fi

FILEDE=analysis/DiagnosisEngine.js;
if test -f "$FILEDE"; then
 mv analysis/DiagnosisEngine.js x.js;
 sed -e 's+\.\./support/+../../support/+' x.js > analysis/DiagnosisEngine.js;
 mv analysis/DiagnosisEngine.js x.js;
 sed -e 's+\./analysis/tmp/+app/analysis/tmp+' x.js > analysis/DiagnosisEngine.js;
 rm x.js;
fi

mv package.json x.json; 
sed -e 's+\.\./\.\./tools/LTLSIM+tools/LTLSIM+' x.json > package.json;
rm x.json;
mv tools/LTLSIM/ltlsim-core/package.json x.json; 
sed -e 's+fret-electron/support/NuSMVParser+../support/NuSMVParser+' x.json > tools/LTLSIM/ltlsim-core/package.json;
rm x.json;



cd ..
mv package.json x.json;
sed -e 's+docs/_media+app/docs/_media+'     -e 's+\.\./tools/LTLSIM+app/tools/LTLSIM+' x.json > package.json;
rm x.json;
mv webpack.config.base.js x.js;
sed -e 's+docs/_media+app/docs/_media+' x.js > webpack.config.base.js;
rm x.js;
cd app/tools/LTLSIM/ltlsim-core;
npm install;
cd -
npm install;
export PATH=`pwd`/app/tools/LTLSIM/ltlsim-core/simulator:$PATH;
npm start;
cd app

#install electron-packager if you don't have it
#npm install -g electron-packager (may need root permissions)
#Notice that electron-packager will package FRET based on the OS that you are running it. For more options check here: https://electron.github.io/electron-packager/master/

electron-packager .

# Alternatively, you can do the following (notice that you need to run electron-packager with npx):
# npm install -D electron-packager
# npx electron-packager .

tar zcvf ~/Desktop/FRET-linux-x64.tgz FRET-linux-x64/
