- can read in formula and/or trace from files; then works as usual
- File format:
  A) Formulas:
  NuSMV syntax, one formula in the file
  Example:
  H ((!((!RES) S ((!RES) & ((MODE & ((! Y TRUE) | (Y ! MODE))) & ((Y (H ! MODE)) | (! Y TRUE)))))) -> (O[0, 0] ((MODE & ((! Y TRUE) | (Y ! MODE))) & ((Y (H ! MODE)) | (! Y TRUE)))))

B) Traces: CSV file.
1st line variable names
2nd.. lines: 0-1 values for each timestep
Example:

MODE,RES
0,1
0,0
1,0
0,0

- calling: for "formula.txt" and "trace.txt":
  cd tools/LTLSIM/ltlsim-core
  npm install
  cd ../ltlsim-electron
  npm install

      export LTL_FORMULAFILE="formula.txt"; export LTL_TRACEFILE="trace.txt"; npm run dev
