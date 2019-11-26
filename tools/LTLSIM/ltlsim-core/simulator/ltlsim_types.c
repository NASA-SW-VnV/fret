#include "ltlsim_types.h"
#include "ltlsim_types_private.h"

ltlsim_model_t *initLTLSimModel() {
    ltlsim_model_t *model = (ltlsim_model_t*)malloc(sizeof(ltlsim_model_t));
    model->nAtomic = 0;
    model->nFormula = 0;
    model->traceLength = 0;
    return model;
}

void addAtomic(ltlsim_model_t *m,  const char *id) {
    if (m == NULL) return;
    if (m->nAtomic < MAX_ATOMICS) {
        _setAtomic(&(m->atomics[m->nAtomic]), id);
        for (int i = 0; i < m->traceLength; i++) {
            if (i >= MAX_TRACELENGTH) break;
            m->atomics[m->nAtomic].trace.values[i] = false;
        }
        m->atomics[m->nAtomic].trace.length = m->traceLength;
        m->nAtomic++;
    }
}

void addFormula(ltlsim_model_t *m,  const char *id, const char *expr) {
    if (m == NULL) return;
    if (m->nFormula < MAX_FORMULAS) {
        _setFormula(&(m->formulas[m->nFormula]), id, expr);
        for (int i = 0; i < m->traceLength; i++) {
            if (i >= MAX_TRACELENGTH) break;
            m->formulas[m->nFormula].trace.values[i] = false;
        }
        m->formulas[m->nFormula].trace.length = m->traceLength;
        m->nFormula++;
    }
}

void setAtomicTrace(ltlsim_model_t *m, unsigned int idx, const bool trace[], unsigned int tl) {
    if (m == NULL) return;
    if (idx < MAX_ATOMICS) _setAtomicTrace(&(m->atomics[idx]), trace, tl);
}

void setFormulaTrace(ltlsim_model_t *m, unsigned int idx, const bool trace[], unsigned int tl) {
    if (m == NULL) return;
    if (idx < MAX_FORMULAS) _setFormulaTrace(&(m->formulas[idx]), trace, tl);
}

void setAtomicTraceAt(ltlsim_model_t *m, unsigned int idx, unsigned int tidx, bool v){
    if (m == NULL) return;
    if (idx < MAX_ATOMICS) _setAtomicTraceAt(&(m->atomics[idx]), tidx, v);
}

void setFormulaTraceAt(ltlsim_model_t *m, unsigned int idx, unsigned int tidx, bool v){
    if (m == NULL) return;
    if (idx < MAX_FORMULAS) _setFormulaTraceAt(&(m->formulas[idx]), tidx, v);
}

void setAtomicTraceLength(ltlsim_model_t *m, unsigned int idx, unsigned int tl) {
    if (m == NULL) return;
    if (idx < MAX_ATOMICS) _setAtomicTraceLength(&(m->atomics[idx]), tl);
}

void setFormulaTraceLength(ltlsim_model_t *m, unsigned int idx, unsigned int tl) {
    if (m == NULL) return;
    if (idx < MAX_FORMULAS) _setFormulaTraceLength(&(m->formulas[idx]), tl);
}

void setFormulaExpression(ltlsim_model_t *m, unsigned int idx, const char *expr) {
    if (m == NULL) return;
    if (idx < MAX_FORMULAS) _setFormula(&(m->formulas[idx]), NULL, expr);
}

void setTraceLength(ltlsim_model_t *m, unsigned int tl) {
    if (m == NULL) return;
    if (tl <= MAX_TRACELENGTH) {
        m->traceLength = tl;
    }
}

atomic_t *getAtomic(ltlsim_model_t *m, const char *id) {
    int idx = getAtomicIdx(m, id);
    return (idx >= 0) ? &(m->atomics[idx]) : NULL;
}

formula_t *getFormula(ltlsim_model_t *m, const char *id) {
    int idx = getFormulaIdx(m, id);
    return (idx >= 0) ? &(m->formulas[idx]) : NULL;
}

int getAtomicIdx(ltlsim_model_t *m, const char *id) {
    for (int i = 0; i < m->nAtomic; i++) {
        if (strcmp(m->atomics[i].id, id) == 0) {
            return i;
        }
    }
    return -1;
}

int getFormulaIdx(ltlsim_model_t *m, const char *id) {
    for (int i = 0; i < m->nFormula; i++) {
        if (strcmp(m->formulas[i].id, id) == 0) {
            return i;
        }
    }
    return -1;
}

void printAtomic(ltlsim_model_t *m, int idx, FILE *out) {
    if (m == NULL) return;
    if (idx >= 0 && idx < (int) MAX_ATOMICS) {
        _printAtomic(&(m->atomics[idx]), out);
    } else if (idx < 0) {
        _printAtomics(m, out);
    }
}

void printFormula(ltlsim_model_t *m, int idx, FILE *out) {
    if (m == NULL) return;
    if (idx >= 0 && idx < (int) MAX_FORMULAS) { 
        _printFormula(&(m->formulas[idx]), out);
    } else if (idx < 0)  {
        _printFormulas(m, out);
    }
}

void printAtomicTrace(ltlsim_model_t *m, int idx, FILE *out) {
    if (m == NULL) return;
    if (idx >= 0 && idx < (int) MAX_ATOMICS) {
        _printTrace(&(m->atomics[idx].trace), out);
        fprintf(out, "\n");
    } else if (idx < 0) {
        _printAtomicTraces(m, out);
    }
}

void printFormulaTrace(ltlsim_model_t *m, int idx, FILE *out) {
    if (m == NULL) return;
    if (idx >= 0 && idx < (int) MAX_FORMULAS) { 
        _printTrace(&(m->formulas[idx].trace), out);
        fprintf(out, "\n");
    } else if (idx < 0)  {
        _printFormulaTraces(m, out);
    }
}

void printModel(ltlsim_model_t *m, FILE *out){
    if (m->nAtomic > 0) {
        fprintf(out, "ATOMICS\n");
        _printAtomics(m, out);
    }
    if (m->nFormula > 0) {
        fprintf(out, "FORMULAS\n");
        _printFormulas(m, out);
    }
    if (m->nAtomic > 0 || m->nFormula > 0) {
        fprintf(out, "TRACES\n");
        _printAtomicTraces(m, out);
        _printFormulaTraces(m, out);
    }
}

static void _setAtomic(atomic_t *a, const char *id) {
    if (a == NULL) return;
    strncpy(a->id, id, MAX_IDENTIFIER_LENGTH);
}

static void _setFormula(formula_t *f, const char *id, const char *expr) {
    if (f == NULL) return;
    if (id != NULL) {
        strncpy(f->id, id, MAX_IDENTIFIER_LENGTH);
    }
    if (expr != NULL) {
        strncpy(f->expression, expr, MAX_EXPRESSION_LENGTH);
    }
}

static void _setAtomicTrace(atomic_t *a, const bool trace[], unsigned int tl) {
    if (a == NULL) return;
    if (tl <= MAX_TRACELENGTH) {
        memcpy(a->trace.values, trace, tl);
        a->trace.length = tl;
    }
}

static void _setFormulaTrace(formula_t *f, const bool trace[], unsigned int tl) {
    if (f == NULL) return;
    if (tl <= MAX_TRACELENGTH) {
        memcpy(f->trace.values, trace, tl);
        f->trace.length = tl;
    }
}

static void _setAtomicTraceAt(atomic_t *a, unsigned int idx, bool v) {
    if (a == NULL) return;
    int tl = a->trace.length;
    if (idx < MAX_TRACELENGTH) {
        a->trace.values[idx] = v;
        if (tl == 0 || idx > tl-1) {
            a->trace.length = idx+1;
            if (idx > tl) {
                for (int i = tl; i < idx; i++) {
                    a->trace.values[i] = a->trace.values[tl-1];
                }
            }
        }
    }
}

static void _setFormulaTraceAt(formula_t *f, unsigned int idx, bool v) {
    if (f == NULL) return;
    int tl = f->trace.length;
    if (idx < MAX_TRACELENGTH) {
        f->trace.values[idx] = v;
        if (idx > tl-1) {
            f->trace.length = idx+1;
            if (idx > tl) {
                for (int i = tl; i < idx; i++) {
                    f->trace.values[i] = false;
                }
            }
        }
    }
}

static void _setAtomicTraceLength(atomic_t *a, unsigned int tl) {
    unsigned int tlold;
    if (a == NULL) return;
    if (tl <= MAX_TRACELENGTH) {
        tlold = a->trace.length;
        a->trace.length = tl;
        if (tlold < tl) {
            if (tlold == 0) {
                for (int i = tlold; i < tl; i++) {
                    a->trace.values[i] = false;
                }
            } else {
                for (int i = tlold; i < tl; i++) {
                    a->trace.values[i] = a->trace.values[tlold-1];
                }
            }
        }
    }
}

static void _setFormulaTraceLength(formula_t *f, unsigned int tl) {
    int tlold;
    if (f == NULL) return;
    if (tl <= MAX_TRACELENGTH) {
        tlold = f->trace.length;
        f->trace.length = tl;
        if (tlold < tl) {
            for (int i = tlold; i < tl; i++) {
                f->trace.values[i] = false;
            }
        }
    }
}

static void _printAtomic(atomic_t * a, FILE *out) {
    if (a == NULL) return;
    fprintf(out, "<id: \"%s\">\n", a->id);
}

static void _printFormula(formula_t * f, FILE *out) {
    if (f == NULL) return;
    fprintf(out, "<id: \"%s\", expression: \"%s\", value: %d>\n", f->id, f->expression, f->value);
}

static void _printAtomics(ltlsim_model_t *m, FILE *out) {
    for (int i = 0; i < m->nAtomic; i++) {
        fprintf(out, " (%d) ", i);
        _printAtomic(&(m->atomics[i]), out);
    }
}

static void _printFormulas(ltlsim_model_t *m, FILE *out) {
    for (int i = 0; i < m->nFormula; i++) {
        fprintf(out, " (%d) ", i);
        _printFormula(&(m->formulas[i]), out);
    }
}

static void _printAtomicTraces(ltlsim_model_t *m, FILE *out) {
    for (int i = 0; i < m->nAtomic; i++) {
        if (m->atomics[i].trace.length > 0) {
            fprintf(out, " %s:\t", m->atomics[i].id);
            _printTrace(&(m->atomics[i].trace), out);
            fprintf(out, "\n");
        }
    }
}

static void _printFormulaTraces(ltlsim_model_t *m, FILE *out) {
    for (int i = 0; i < m->nFormula; i++) {
        if (m->formulas[i].trace.length > 0) {
            fprintf(out, " %s:\t", m->formulas[i].id);
            _printTrace(&(m->formulas[i].trace), out);
            fprintf(out, " (%d)\n", m->formulas[i].value);
        }
    }
}

static void _printTrace(trace_t *t, FILE *out) {
    if (t == NULL) return;
    for (int i = 0; i < t->length; i++) {
        fprintf(out, "%d", t->values[i]);
    }
}