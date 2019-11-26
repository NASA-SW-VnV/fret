#include "ltlsim_commands.h"
#include "ltlsim_commands_private.h"

int processCommand(ltlsim_model_t *m, const char *cmdline, FILE *out) {
    char *str = (char *)malloc(MAX_COMMAND_LENGTH);
    char *cmd = NULL;
    char *args[MAX_ARGS] = { NULL };
    unsigned int argc = 0;
    strncpy(str, cmdline, MAX_COMMAND_LENGTH);
    str[strcspn(str, "\n")] = 0;
    cmd = _getSym(&str);

    for (int i = 0; i < MAX_ARGS; i++) {
        if (cmd != NULL && 
                (strcmp(cmd, CMD_ADD_FORMULA) == 0 ||
                 strcmp(cmd, CMD_ADD_FORMULA_SHORT) == 0 ||
                 strcmp(cmd, CMD_SET_FORMULA) == 0 ||
                 strcmp(cmd, CMD_SET_FORMULA_SHORT) == 0
                ) && i==1 ) {
            if (str != NULL) {
                args[i] = str;
                argc++;
            }
            break;
        }
        args[i] = _getSym(&str);
        if (args[i] == NULL) {
            break;
        } else {
            argc++;
        }
    }

    if (cmd == NULL) {
        return 3;
    } else if (strcmp(cmd, CMD_EXIT) == 0) {
        return 0;
    } else if (*cmd == '\0') {
        return 3;
    } else if (strcmp(cmd, CMD_COMMANDS) == 0 || strcmp(cmd, CMD_COMMANDS_SHORT) == 0) {
        _execCommandsCommand();
        return 1;
    } else if (strcmp(cmd, CMD_ADD_ATOMIC) == 0 || strcmp(cmd, CMD_ADD_ATOMIC_SHORT) == 0) {
        _execAddAtomicCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_ADD_FORMULA) == 0 || strcmp(cmd, CMD_ADD_FORMULA_SHORT) == 0) {
        _execAddFormulaCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_ANALYSE_FORMULA) == 0 || strcmp(cmd, CMD_ANALYSE_FORMULA_SHORT) == 0) {
        _execAnalyseFormulaCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_ANALYSE_MODEL) == 0 || strcmp(cmd, CMD_ANALYSE_MODEL_SHORT) == 0) {
        _execAnalyseModelCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_SET_ATOMIC) == 0 || strcmp(cmd, CMD_SET_ATOMIC_SHORT) == 0) {
        _execSetAtomicCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_SET_FORMULA) == 0 || strcmp(cmd, CMD_SET_FORMULA_SHORT) == 0) {
        _execSetFormulaCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_SET_TRACELENGTH) == 0 || strcmp(cmd, CMD_SET_TRACELENGTH_SHORT) == 0) {
        _execSetTracelengthCommand(m, args, argc);
        return 1;
    } else if (strcmp(cmd, CMD_PRINT_MODEL) == 0 || strcmp(cmd, CMD_PRINT_MODEL_SHORT) == 0) {
        _execPrintModelCommand(m, out);
        return 1;
    } else if (strcmp(cmd, CMD_PRINT_ATOMIC) == 0 || strcmp(cmd, CMD_PRINT_ATOMIC_SHORT) == 0) {
        _execPrintAtomicCommand(m, args, argc, out);
        return 1;
    } else if (strcmp(cmd, CMD_PRINT_FORMULA) == 0 || strcmp(cmd, CMD_PRINT_FORMULA_SHORT) == 0) {
        _execPrintFormulaCommand(m, args, argc, out);
        return 1;
    } else if (strcmp(cmd, CMD_PRINT_ATOMIC_TRACE) == 0 || strcmp(cmd, CMD_PRINT_ATOMIC_TRACE_SHORT) == 0) {
        _execPrintAtomicTraceCommand(m, args, argc, out);
        return 1;
    } else if (strcmp(cmd, CMD_PRINT_FORMULA_TRACE) == 0 || strcmp(cmd, CMD_PRINT_FORMULA_TRACE_SHORT) == 0) {
        _execPrintFormulaTraceCommand(m, args, argc, out);
        return 1;
    } else {
        printf("Unknown command \"%s\".\n", cmd);
        printf("Type \"commands\" for a list of commands.\n");
        return 2;
    }
}

static char *_getSym(char **str) {
    char *sym;
    sym = strtok_r(*str, " ", str);
    _stripCtrlCharacters(sym);
    return sym;
}

static void _stripCtrlCharacters(char *str) {
    unsigned char *ptr, *s = (unsigned char *)str;
    ptr = s;

    if (str != NULL) {
        while (*s != '\0') {
            if ((int)*s > 32 && (int)*s < 127) {
                *(ptr) = *s;
                ptr++;
            }
            s++;
        }
        *ptr = '\0';
    }
}


static int _execCommandsCommand(void) {
    printf(" %-5s  %-19s  %-10s  %s\n", "SHORT", "LONG", "ARGUMENTS", "DESCRIPTION");
    printf(" -----  -------------------  ----------  -----------\n");
    printf(" %-5s  %-19s  %-10s  Display this list.\n", CMD_COMMANDS_SHORT, CMD_COMMANDS, CMD_COMMANDS_ARGS);
    printf(" %-5s  %-19s  %-10s  Add a new atomic with ID <id> and\n%-40s optionally <trace>.\n", CMD_ADD_ATOMIC_SHORT, CMD_ADD_ATOMIC, CMD_ADD_ATOMIC_ARGS, "");
    printf(" %-38s  A trace is specified by (0|1)(0|1|\\*)*, \n", "");
    printf(" %-38s  where * will pad the trace to the current \n", "");
    printf(" %-38s  trace length with the last given value. \n", "");
    printf(" %-38s  Otherwise the trace is padded with 0.\n", "");
    printf(" %-5s  %-19s  %-10s  Add a new formula with ID <id> and\n%-40s optionally epxression <expr>.\n", CMD_ADD_FORMULA_SHORT, CMD_ADD_FORMULA, CMD_ADD_FORMULA_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Set the trace of the atomic with\n%-40s ID <id> to <trace>. \n", CMD_SET_ATOMIC_SHORT, CMD_SET_ATOMIC, CMD_SET_ATOMIC_ARGS, "");
    printf(" %-38s  A trace is specified as in add-atomic.\n", "");
    printf(" %-5s  %-19s  %-10s  Set the expression of the formula\n%-40s with ID <id> to <expr>.\n", CMD_SET_FORMULA_SHORT, CMD_SET_FORMULA, CMD_SET_FORMULA_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Analyse all formulas currently in\n%-40s the model.\n", CMD_ANALYSE_MODEL_SHORT, CMD_ANALYSE_MODEL, CMD_ANALYSE_MODEL_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Analyse the formula with ID <id>.\n", CMD_ANALYSE_FORMULA_SHORT, CMD_ANALYSE_FORMULA, CMD_ANALYSE_FORMULA_ARGS);
    printf(" %-5s  %-19s  %-10s  Set the model trace length to <tl>.\n%-40s This updates the traces of all atomics\n%-40s and formulas.\n", CMD_SET_TRACELENGTH_SHORT, CMD_SET_TRACELENGTH, CMD_SET_TRACELENGTH_ARGS, "", "");
    printf(" %-5s  %-19s  %-10s  Print the atomics, formulas and\n%-40s traces of the current model.\n", CMD_PRINT_MODEL_SHORT, CMD_PRINT_MODEL, CMD_PRINT_MODEL_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Print information for the atomic with\n%-40s ID <id>, or all atomics if no ID is specified.\n", CMD_PRINT_ATOMIC_SHORT, CMD_PRINT_ATOMIC, CMD_PRINT_ATOMIC_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Print information for the formula with\n%-40s ID <id>, or all formulas if no ID is specified.\n", CMD_PRINT_FORMULA_SHORT, CMD_PRINT_FORMULA, CMD_PRINT_FORMULA_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Print the trace of the atomic with\n%-40s ID <id>, or of all atomics if no ID is specified.\n", CMD_PRINT_ATOMIC_TRACE_SHORT, CMD_PRINT_ATOMIC_TRACE, CMD_PRINT_ATOMIC_TRACE_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Print the trace of the formula with\n%-40s ID <id>, or of all formulas if no ID is specified.\n", CMD_PRINT_FORMULA_TRACE_SHORT, CMD_PRINT_FORMULA_TRACE, CMD_PRINT_FORMULA_TRACE_ARGS, "");
    printf(" %-5s  %-19s  %-10s  Exit ltlsim.\n", CMD_EXIT, CMD_EXIT, "");
    return 0;
}

static int _checkArgId(char *arg) {
    regex_t regex;
    const char * pattern = "^[_a-zA-Z][_a-zA-Z0-9]*$";
    int status;

    if (regcomp(&regex, pattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }
    status = regexec(&regex, arg, 0, NULL, 0);
    regfree(&regex);
    return status;
}

static int _checkArgTrace(char *arg) {
    regex_t regex;
    const char * pattern = "^[01]+\\*?$";
    int status;

    if (regcomp(&regex, pattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }
    status = regexec(&regex, arg, 0, NULL, 0);
    regfree(&regex);
    return status;
}

static int _execAddAtomicCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    char *id;
    char *trace;
    unsigned int tl;
    int ti;
    if (argc > 0) {
        id = args[0];
        if (getAtomic(m, id) != NULL) {
            printf("Id %s already taken.\n", id);
            return -1;
        }
        if (_checkArgId(id)) {
            printf("Invalid id %s.\n", id);
            return -1;
        }

        if (argc > 1) {
            trace = args[1];
            if (_checkArgTrace(trace)) {
                printf("Invalid trace.\n");
                return -1;
            } 
            addAtomic(m, id);
            tl = strlen(trace);
            for (ti = 0; ti < tl; ti++) {
                if (trace[ti] == '*') {
                    tl--;
                    break;
                }
                setAtomicTraceAt(m, m->nAtomic-1, ti, trace[ti] == '1');
            }
            if (tl > m->traceLength) {
                setTraceLength(m, tl);
                for (int i = 0; i < m->nAtomic; i++) {
                    setAtomicTraceLength(m, i, tl);
                }
                for (int i = 0; i < m->nFormula; i++) {
                    setFormulaTraceLength(m, i, tl);
                }
            } else {
                setAtomicTraceLength(m, m->nAtomic-1, m->traceLength);
                if (ti > 0 && trace[ti] == '*') {
                    for (int i = tl-1; i < m->traceLength; i++) {
                        setAtomicTraceAt(m, m->nAtomic-1, i, trace[ti-1] == '1');
                    }
                }
            }
        } else {
           addAtomic(m, id);
        }

        if (argc > 2) {
            printf("[WARN] Ignoring extra arguments\n");
        }
    } else {
        printf("Not enough arguments (at least 1 required)\n");
        return -1;
    }
    return 0;
}

static int _execAddFormulaCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    char *id = NULL;
    char *expr = NULL;
    if (argc > 0) {
        id = args[0];
        if (getFormula(m, id) != NULL)  {
            printf("Id %s already taken.\n", id);
            return -1;
        }
        if (_checkArgId(id)) {
            printf("Invalid id.\n");
            return -1;
        }
        if (argc > 1) {
            expr = args[1];
        }
        addFormula(m, id, expr);
    } else {
        printf("Not enough arguments (at least 1 required)\n");
        return -1;
    }
    return 0;
}

static int _execSetAtomicCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    char *id;
    char *trace;
    int idx, tidx, ti;
    unsigned int tl;
    if (argc > 1) {
        id = args[0];
        idx = getAtomicIdx(m, id);
        if (idx < 0) {
            printf("Atomic with id %s not found.\n", id);
            return -1;
        }
        if (argc > 2) {
            tidx  = atoi(args[1]);
            if (tidx < 0 || tidx >= MAX_TRACELENGTH) {
                printf("Invalid trace index (must be a positive number lower than the maximum tracelength)\n");
                return -1;
            }
            trace = args[2];
        } else {
            tidx  = 0;
            trace = args[1];
        }
        if (_checkArgTrace(trace)) {
            printf("Invalid trace.\n");
            return -1;
        }
        tl = tidx+strlen(trace);
        for (ti = 0; ti < strlen(trace); ti++) {
            if (trace[ti] == '*') {
                tl--;
                break;
            }
            setAtomicTraceAt(m, idx, ti+tidx, trace[ti] == '1');
            if (ti >= MAX_TRACELENGTH) {
                	printf("[WARN] Specified trace too long. Ignoring extra trace elements.\n");
            }
        }
        if (tl > m->traceLength) {
            setTraceLength(m, tl);
            for (int i = 0; i < m->nAtomic; i++) {
                setAtomicTraceLength(m, i, tl);
            }
            for (int i = 0; i < m->nFormula; i++) {
                setFormulaTraceLength(m, i, tl);
            }
        } else {
            setAtomicTraceLength(m, idx, m->traceLength);
            if (ti > 0 && trace[ti] == '*') {
                for (int i = tl; i < m->traceLength; i++) {
                    setAtomicTraceAt(m, idx, i, trace[ti-1] == '1');
                }
            }
        }

        if (argc > 3) {
            printf("[WARN] Ignoring extra arguments\n");
        }
    } else {
        printf("Not enough arguments (2 required)\n");
        return -1;
    }
    return 0;
}

static int _execSetFormulaCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    char *id = NULL;
    char *expr = NULL;
    int idx;
    if (argc == 2) {
        id = args[0];
        expr = args[1];
        idx = getFormulaIdx(m, id);
        if (idx < 0) {
            printf("Formula with id %s not found.\n", id);
            return -1;
        }
        setFormulaExpression(m , idx, expr);
    } else {
        printf("Not enough arguments (2 required)\n");
        return -1;
    }
    return 0;
}
static int _execAnalyseFormulaCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    char *id = NULL;
    int idx, status = -1;
    if (argc > 0) {
        id = args[0];
        idx = getFormulaIdx(m, id);
        if (idx < 0) {
            printf("Formula with id %s not found.\n", id);
            return -1;
        }
        if (argc > 1) {
            printf("[WARN] Ignoring extra arguments\n");
        }
        status = ltlsim_analyse(m, idx, true);
    } else {
        printf("Not enough arguments (1 required)\n");
        return -1;
    }
    return status;
}
static int _execAnalyseModelCommand(ltlsim_model_t *m, char **args, unsigned int argc)  {
    int status = 0;
    if (argc > 0) {
        printf("[WARN] Ignoring extra arguments\n");
    }
    for (int idx = 0; idx < m->nFormula; idx++) {
        if (ltlsim_analyse(m, idx, true)) status = -1;
    }
    return status;
}

static int _execSetTracelengthCommand(ltlsim_model_t *m, char **args, unsigned int argc) {
    int tl;
    if (argc > 0) {
        tl = atoi(args[0]);
        if (tl < 0) {
            printf("Invalid tracelength (must be a positive number)\n");
            return -1;
        }
        setTraceLength(m, (unsigned int) tl);
        for (int i = 0; i < m->nAtomic; i++) {
            setAtomicTraceLength(m, i, tl);
        }
        for (int i = 0; i < m->nFormula; i++) {
            setFormulaTraceLength(m, i, tl);
        }
        if (argc > 2) {
            printf("[WARN] Ignoring extra arguments\n");
        }
    } else {
        printf("Not enough arguments (1 required)\n");
        return -1;
    }
    return 0;
}

static int _execPrintModelCommand(ltlsim_model_t *m, FILE *out) {
    printModel(m, out);
    return 0;
}

static int _execPrintAtomicCommand(ltlsim_model_t *m, char **args, unsigned int argc, FILE *out) {
    char *id;
    int idx;
    if (argc > 0) {
        id = args[0];
        idx = getAtomicIdx(m, id);
        if (idx < 0) {
            printf("Atomic with id %s not found.\n", id);
            return -1;
        }
        printAtomic(m, idx, out);
    } else {
        printAtomic(m, -1, out);
    }
    return 0;
}

static int _execPrintFormulaCommand(ltlsim_model_t *m, char **args, unsigned int argc, FILE *out) {
    char *id;
    int idx;
    if (argc > 0) {
        id = args[0];
        idx = getFormulaIdx(m, id);
        if (idx < 0) {
            printf("Formula with id %s not found.\n", id);
            return -1;
        }
        printFormula(m, idx, out);
    } else {
        printFormula(m, -1, out);
    }
    return 0;
}

static int _execPrintAtomicTraceCommand(ltlsim_model_t *m, char **args, unsigned int argc, FILE *out) {
    char *id;
    int idx;
    if (argc > 0) {
        id = args[0];
        idx = getAtomicIdx(m, id);
        if (idx < 0) {
            printf("Atomic with id %s not found.\n", id);
            return -1;
        }
        printAtomicTrace(m, idx, out);
    } else {
        printAtomicTrace(m, -1, out);
    }
    return 0;
}

static int _execPrintFormulaTraceCommand(ltlsim_model_t *m, char **args, unsigned int argc, FILE *out) {
    char *id;
    int idx;
    if (argc > 0) {
        id = args[0];
        idx = getFormulaIdx(m, id);
        if (idx < 0) {
            printf("Formula with id %s not found.\n", id);
            return -1;
        }
        printFormulaTrace(m, idx, out);
    } else {
        printFormulaTrace(m, -1, out);
    }
    return 0;
}
