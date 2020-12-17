#include "ltlsim_smvutils.h"
#include "ltlsim_smvutils_private.h"

// #define DEBUG
// #define KEEP_TMP_FILES

int ltlsim_analyse(ltlsim_model_t *m, int idx, bool doTrace) {
    char fn[SMV_BUFFER];
    if (idx < 0) {
        strncpy(fn, "tmp.smv", SMV_BUFFER);
    } else {
        strncpy(fn, m->formulas[idx].id, SMV_BUFFER);
        strncat(fn, ".smv", SMV_BUFFER);
    }
    if (_genFSM(m, idx, fn, doTrace)) return -1;
    if (_callSMV(m, idx, fn, doTrace)) {
        _rmFSM(fn);
        return -1;
    }
    if (_rmFSM(fn)) return -1;
    return 0;
}


int checkNuSMVInstallation(bool doPrint) {
    FILE * fp;
    char buffer[SMV_BUFFER];
    int status = -1;
    regex_t regex;
    regmatch_t match[1];
    char *pattern = "This is NuSMV";

#ifdef WINDOWS
    fp = popen("nusmv.exe -h 2>&1", "r");
#else
    fp = popen("nusmv -h 2>&1", "r");
#endif

    if (fp == NULL) {
        fprintf(stderr, "[Error] Unknown error during call to NuSMV.\n");
        return status;
    }

    if (regcomp(&regex, pattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return status;
    }

    while (fgets(buffer, SMV_BUFFER, fp) != NULL) {
        if (doPrint) {
            printf("[NuSMV] %s", buffer);
        }
        if (status && regexec(&regex, buffer, 1, match, 0) == 0) {
            /* At the first match set the status to 0. Like this the regex
            is not executed anymore on the subsequent lines */
            status = 0;
        }
    }

    regfree(&regex);

    if (pclose(fp) == -1) {
        return -1;
    }
    return status;
}

static int _genFSM(ltlsim_model_t *m, int idx, const char *fn, bool doTrace) {

    FILE *fp;

    fp = fopen(fn, "w");
    fprintf(fp, "MODULE main\n");
    if (_genState(fp, m->traceLength > 0 ? m->traceLength-1 : m->traceLength)) {
        fprintf(stderr, "[Error] State generation not successful\n");
        fclose(fp);
        return -1;
    }
    if (_genTrace(fp, m)) {
        fprintf(stderr, "[Error] Trace generation not successful\n");
        fclose(fp);
        return -1;
    }
    if (_genSpec(fp, m, idx, doTrace)) {
        fprintf(stderr, "[Error] Specification generation not successful\n");
        fclose(fp);
        return -1;
    }
    fclose(fp);
    return 0;
}

static int _genState(FILE *fp, unsigned int tmax) {

    fprintf(fp, "VAR\n");
    fprintf(fp, "    %st : 0 .. %u;\n", FSM_TIME_PREFIX, tmax);
    fprintf(fp, "ASSIGN\n");
    fprintf(fp, "    init(%st) := 0;\n", FSM_TIME_PREFIX);
    fprintf(fp, "    next(%st) := (%st >= %u) ? %u : %st + 1;\n",
		FSM_TIME_PREFIX, FSM_TIME_PREFIX, tmax, tmax, FSM_TIME_PREFIX);
    return 0;

}

static int _genTrace(FILE *fp, ltlsim_model_t *m) {

    int iAtomic, iTime;
    bool hasEdges, curState;

    fprintf(fp, "DEFINE\n");
    for (iAtomic = 0; iAtomic < m->nAtomic; iAtomic++) {
        curState = m->atomics[iAtomic].trace.values[0];
        hasEdges = false;
        for (iTime = 0; iTime < m->traceLength; iTime++) {
            if (iTime > 0) {
                if (m->atomics[iAtomic].trace.values[iTime] != curState) {
                    if (!hasEdges) {
                        fprintf(fp, "    %s := case\n", m->atomics[iAtomic].id);
                        hasEdges = true;
                    }
                    if (curState) {
                        fprintf(fp, "        %st <= %d : %s;\n", FSM_TIME_PREFIX, iTime-1, "TRUE");
                    } else {
                        fprintf(fp, "        %st <= %d : %s;\n", FSM_TIME_PREFIX, iTime-1, "FALSE");
                    }
                    curState = m->atomics[iAtomic].trace.values[iTime];
                }
            }
        }
        if (hasEdges) {
            if (curState) {
                fprintf(fp, "        TRUE   : %s;\n", "TRUE");
            } else {
                fprintf(fp, "        TRUE   : %s;\n", "FALSE");
            }
            fprintf(fp, "    esac;\n");
        } else {
            if (curState) {
                fprintf(fp, "    %s := %s;\n", m->atomics[iAtomic].id, "TRUE");
            } else {
                fprintf(fp, "    %s := %s;\n", m->atomics[iAtomic].id, "FALSE");
            }
        }
    }
    return 0;

}

static int _genSpec(FILE *fp, ltlsim_model_t *m, int idx, bool doTrace) {
    int iFormula;

    if (idx >= (int)(m->nFormula)) {
        fprintf(stderr, "[Error] Specified index (%d) is greater than the number of formulas (%d).\n", idx, m->nFormula);
        return -1;
    } else if (idx < 0) {
        for (iFormula = 0; iFormula < m->nFormula; iFormula++) {
            _genFormulaSpec(fp, &(m->formulas[iFormula]), doTrace);
        }
    } else {
        _genFormulaSpec(fp, &(m->formulas[idx]), doTrace);
    }
    return 0;
}

static int _genFormulaSpec(FILE *fp, formula_t *f, bool doTrace) {
    int iTime;
    char f_expr[MAX_EXPRESSION_LENGTH];
	//
	// print formula for overall evaluation (ie. without time-point)
	//
	// first: replace FTP or LAST
    _prepFormula(f_expr,f->expression);
    fprintf(fp, "LTLSPEC NAME %s := %s;\n", f->id, f_expr);

	//
	// if to generate trace: do for each timepoint t
	//
    if (doTrace) {
        for (iTime = 0; iTime < f->trace.length; iTime++) {
            fprintf(fp, "LTLSPEC NAME %s_%st%d := G((%st=%d) -> (%s));\n",
                        f->id, FSM_TIME_PREFIX, iTime, FSM_TIME_PREFIX, iTime, f->expression);
        }
    }
    return 0;
}

static int _callSMV(ltlsim_model_t *m, int idx, const char *fn, bool doTrace) {
    FILE * fp;
    char buffer[SMV_BUFFER];
    regex_t fregex, tregex;
    int status, iFormula = -1, iTime = 0;
    const int nMatch = 4;
    regmatch_t matches[nMatch];
    bool value, tmatch = false;
    const char* fpattern = "-- specification[ ]+(.*)[ ]+is[ ]+(true|false)[ ]*";
    char tpattern[SMV_BUFFER];

    sprintf(tpattern,"-- specification[ ]+G[ ]*\\(%st[ ]*=[ ]*[0-9]+[ ]+->[ ]+(.*)[ ]*\\)[ ]+is[ ]+(true|false)[ ]*",FSM_TIME_PREFIX);

#ifdef DEBUG
    printf("tpattern=>%s<\n", tpattern);
#endif

//    const char* tpattern = "-- specification[ ]+G[ ]*\\(t[ ]*=[ ]*[0-9]+[ ]+->[ ]+(.*)[ ]*\\)[ ]+is[ ]+(true|false)[ ]*";

    if (regcomp(&fregex, fpattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }
    if (doTrace && regcomp(&tregex, tpattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }

#ifdef WINDOWS
    status = snprintf(buffer, SMV_BUFFER, "nusmv.exe -dcx %s", fn);
#else
    status = snprintf(buffer, SMV_BUFFER, "nusmv -dcx %s", fn);
#endif
#ifdef DEBUG
    printf("[NuSMV] command: %s", buffer);
#endif

    if (status < 0) {
        fprintf(stderr, "[Error] Filename too long.\n");
        regfree(&fregex);
        regfree(&tregex);
        return -1;
    }

    fp = popen(buffer, "r");
    if (fp == NULL) {
        fprintf(stderr, "[Error] Unknown error during call to NuSMV.\n");
        regfree(&fregex);
        regfree(&tregex);
        return -1;
    }

    while (fgets(buffer, SMV_BUFFER, fp) != NULL) {
#ifdef DEBUG
        printf("[NuSMV] %s", buffer);
#endif
        if (doTrace) {
            status = regexec(&tregex, buffer, nMatch, matches, 0);
        } else {
            status = 1;
        }

        if (status) {
            status = regexec(&fregex, buffer, nMatch, matches, 0);
            if (status) {
                continue;
            } else {
                tmatch = false;
                iFormula++;
                iTime = 0;
            }
        } else {
            tmatch = true;
        }
        if (strncmp("true", buffer+matches[2].rm_so,
                matches[2].rm_eo-matches[2].rm_so) == 0) {
            value = true;
        } else if (strncmp("false", buffer+matches[2].rm_so,
                matches[2].rm_eo-matches[2].rm_so) == 0) {
            value = false;
        }
        if (idx >= 0) {
            iFormula = idx;
        }
        if (tmatch) {
            m->formulas[iFormula].trace.values[iTime] = value;
            iTime++;
        } else {
            m->formulas[iFormula].value = value;
        }
    }

#ifdef DEBUG
    printf("Done\n");
#endif
    if (pclose(fp) == -1) {
        regfree(&fregex);
        regfree(&tregex);
        return -1;
    }

    regfree(&fregex);
    regfree(&tregex);
    return 0;
}

static int _rmFSM(const char *fn) {
#ifndef KEEP_TMP_FILES
    if (remove(fn)) {
        return -1;
    }
#endif
    return 0;
}

static void _prepFormula(char *f_expr, const char *expr){

//strncpy(f_expr,expr,MAX_EXPRESSION_LENGTH);

printf(">>>%s<<\n",expr);

char B[MAX_EXPRESSION_LENGTH];
char A[MAX_EXPRESSION_LENGTH];
char *l;

strncpy(f_expr,expr,MAX_EXPRESSION_LENGTH);

while((l = strstr(f_expr, "LAST"))){
printf("      >>>%s<<\n",l);
	sprintf(B, "%.*s", (int)(l - f_expr), f_expr);
	sprintf(A, "%s", l + 4);  // length of LAST
	sprintf(f_expr,"%s%s%s",B,"TRUE",A);
	}
}
