### Response (mandatory)

Specifies the response that the component must provide to fulfill the requirement.
The current version of FRET supports the form:

**satisfy** BEXP (Boolean Expression, see the help for the Condition field).

#### RESTRICTIONS

The following identifiers cannot be used as variables in Boolean
and arithmetic expressions:

`MODULE, DEFINE, MDEFINE, CONSTANTS, VAR, IVAR, FROZENVAR, INIT, TRANS,
INVAR, SPEC, CTLSPEC, LTLSPEC, PSLSPEC, COMPUTE, NAME, INVARSPEC, FAIRNESS,
JUSTICE, COMPASSION, ISA, ASSIGN, CONSTRAINT, SIMPWFF, CTLWFF, LTLWFF,
PSLWFF, COMPWFF, IN, MIN, MAX, MIRROR, PRED, PREDICATES, process, array,
boolean, bool, integer, real, word, word1, signed, unsigned, extend, resize,
sizeof, uwconst, swconst, EX, AX, EF, AF, EG, AG, E, F, O, G, H, X, Y, Z, A,
U, S, V, T, BU, EBF, ABF, EBG, ABG, case, esac, init, union, xor, xnor, self,
count, abs, max, min, mod, of, in, next`.  

