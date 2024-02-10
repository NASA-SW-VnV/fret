#include "ltlsim_smvutils.h"
#include "ltlsim_smvutils_private.h"

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
    char *pattern;
    const char *smv_binary;

    smv_binary = getenv(LTLSIM_BINARY);
    if (!smv_binary){
	smv_binary = nusmvBinaryName;
	}

    if (!strcasecmp(smv_binary, "nusmv")){
 	pattern = "This is NuSMV";
	}
    else {
 	pattern = "This is nuXmv";
	}

#ifdef WINDOWS
    sprintf(buffer,"%s.exe -h 2>&1",smv_binary);
    fp = popen(buffer, "r");
#else
    sprintf(buffer,"%s -h 2>&1",smv_binary);
    fp = popen(buffer, "r");
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
    fprintf(fp, "    t : 0 .. %u;\n", tmax+1);
    fprintf(fp, "ASSIGN\n");
    fprintf(fp, "    init(t) := 0;\n");
    fprintf(fp, "    next(t) := (t >= %u) ? %u : t + 1;\n", tmax+1, tmax+1);
    return 0;

}

/*
static int _genState(FILE *fp, unsigned int tmax) {

    fprintf(fp, "VAR\n");
    fprintf(fp, "    t : 0 .. %u;\n", tmax);
    fprintf(fp, "ASSIGN\n");
    fprintf(fp, "    init(t) := 0;\n");
    fprintf(fp, "    next(t) := (t >= %u) ? %u : t + 1;\n", tmax, tmax);
    return 0;

}
*/

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
                        fprintf(fp, "        t <= %d : %s;\n", iTime-1, "TRUE");
                    } else {
                        fprintf(fp, "        t <= %d : %s;\n", iTime-1, "FALSE");
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
    fprintf(fp, "LTLSPEC NAME %s := %s;\n", f->id, f->expression);
    if (doTrace) {
        for (iTime = 0; iTime < f->trace.length; iTime++) {
            fprintf(fp, "LTLSPEC NAME %s_t%d := G((t=%d) -> (%s));\n", 
                        f->id, iTime, iTime, f->expression);
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
    const char *smv_binary;
    const char* fpattern = "-- specification[ ]+(.*)[ ]+is[ ]+(true|false)[ ]*";
    const char* tpattern = "-- specification[ ]+G[ ]*\\(t[ ]*=[ ]*[0-9]+[ ]+->[ ]+(.*)[ ]*\\)[ ]+is[ ]+(true|false)[ ]*";

    if (regcomp(&fregex, fpattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }
    if (doTrace && regcomp(&tregex, tpattern, REG_EXTENDED)) {
        fprintf(stderr, "[Error] Could not compile regex.\n");
        return -1;
    }


    smv_binary = getenv(LTLSIM_BINARY);
    if (!smv_binary){
	smv_binary = nusmvBinaryName;
	}

#ifdef WINDOWS
    status = snprintf(buffer, SMV_BUFFER, "%s.exe -dcx %s", smv_binary, fn);
#else
    status = snprintf(buffer, SMV_BUFFER, "%s -dcx %s", smv_binary, fn);
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
        // printf("[NuSMV] %s", buffer);
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

    // printf("Done\n");
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
