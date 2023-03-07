# Assumptions
### Will go into README

* Requirements do not contain any SMV reserved keywords: "MODULE", "DEFINE", "MDEFINE", "CONSTANTS", "VAR", "IVAR", "FROZENVAR", "INIT", "TRANS", "INVAR", "SPEC", "CTLSPEC", "LTLSPEC", "PSLSPEC", "COMPUTE", "NAME", "INVARSPEC", "FAIRNESS", "JUSTICE", "COMPASSION", "ISA", "ASSIGN", "CONSTRAINT", "SIMPWFF", "CTLWFF", "LTLWFF", "PSLWFF", "COMPWFF", "IN", "MIN", "MAX", "MIRROR", "PRED", "PREDICATES", "process", "array", "of", "boolean", "integer", "real", "word", "word1", "bool", "signed", "unsigned", "extend", "resize", "sizeof", "uwconst", "swconst", "EX", "AX", "EF", "AF", "EG", "AG", "E", "F", "O", "G", "H", "X", "Y", "Z", "A", "U", "S", "V", "T", "BU", "EBF", "ABF", "EBG", "ABG", "case", "esac", "mod", "next", "init", "union", "in", "xor", "xnor", "self", "TRUE", "FALSE", "count", "abs", "max", "min" 
 - - Note: FRET will not stop you from using them.
   - However, when run in developer mode (`npm run dev`) the console will show errors if you misuse these keywords.
 * Fragments have the same spacing in all the requirements they are used. E.g. "the_var = 2" and "the_var=2" will not be matched. 
 * Variable names in requirements do not contain underscores. (NuSMV doesn't like them, but FRET wont stop you from using them.)
 * Requirements parse as valid FRETISH
 * Variable names are only repeated within the same component. 
 * FRET's analysis portal supports more _data types_ than NuSMV, so for Mu-FRET to successfully refactor requirements, they should only use Boolean and Integer variables. 
   * Unsigned Integers will be treated as Integers – this is consistent with FRET's approach to exporting requirements to CoCo Spec, where any integer (signed or unsigned) in Simulink will become an integer variable in CoCo Spec/Lustre
   * Single and Double variables cannot be supported, even though FRETISH allows direct comparisons to real numbers (e.g. `variable > 2.4`) NuSMV does not support "real constants"
   * The Mu-FRET refactoring UI warns users about these problems if variables have already been assigned an unsupported type.



