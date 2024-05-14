/** \file ltlsim_types.h
 *  Datatypes and functions for creation and modification of ltlsim models.
 *
 */
#ifndef LTLSIM_TYPES_H
#define LTLSIM_TYPES_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_EXPRESSION_LENGTH 65536 //!< Maximum number of characters for expressions ttp:was 4096
#define MAX_IDENTIFIER_LENGTH 128 //!< Maximum number of characters for idetifiers
#define MAX_COMMAND_LENGTH (MAX_EXPRESSION_LENGTH+MAX_IDENTIFIER_LENGTH) //!< Maximum length of commands
#define MAX_FORMULAS 128 //!< Maximum number of formulas
#define MAX_ATOMICS 128 //!< Maximum number of atomics
#define MAX_TRACELENGTH 512 //!< Maximum length of traces


#define FSM_TIME_PREFIX "ltlsim_"


/** \brief Structure for a single trace.
 *
 * A trace is a series of boolean values.
 */
typedef struct {
    bool values[MAX_TRACELENGTH]; //!< Value of the trace
    unsigned int length; //!< Length of the trace
} trace_t;

/** \brief Structure for an atomic proposition.
 *
 * An atomic proposition represents a propositional
 * variable in the formulas expressions. An atomic is associated
 * with a trace of boolean valuesmm describing its valuation over time.
 */
typedef struct {
    char id[MAX_IDENTIFIER_LENGTH]; //!< Unique identifier
    trace_t trace; //!< The trace associated with the atomic
} atomic_t;

/** \brief Structure for a formula
 *
 * A formula is represented by a LTL expression. When a formula is evaluated,
 * its trace is calculated, representing the timed valuation of the formula.
 * Additionally, the overall valuation of the formula, i.e. whether of not
 * the trace defined by the formulas atomics is consistent with the formula
 * expression, is determined
 */
typedef struct {
    char id[MAX_IDENTIFIER_LENGTH]; //!< Unique identifier
    char expression[MAX_EXPRESSION_LENGTH]; //!< The formula expression
    trace_t trace; //!< The trace associated with the formula
    bool value; //!< The overall valuation
} formula_t;

/** \brief Structure for a collection of formulas.
 */
typedef struct {
    formula_t formulas[MAX_FORMULAS]; //!< The formulas
    unsigned int length; //!< Number of formulas
} formulas_t;

/** \brief Structure for a collection of atomics.
 */
typedef struct {
    atomic_t atomics[MAX_ATOMICS]; //!< The atomics
    unsigned int length; //!< Number of atomics
} atomics_t;

/** \brief Structure for an ltlsim model.
 *
 * A ltlsim model is a collection of atomics and formulas.
 * Additionally, it has a tracelength property, which represents
 * the length of the traces of all associated atomics and formulas.
 */
typedef struct {
    formula_t formulas[MAX_FORMULAS]; //!< The formulas
    atomic_t atomics[MAX_ATOMICS]; //!< The atomics
    unsigned int nFormula; //!< Number of formulas
    unsigned int nAtomic; //!< Number of atomics
    unsigned int traceLength; //!< The model trace length
} ltlsim_model_t;

/** \brief Initialize a new ltlsim model.
 *
 * Allocates memory for a new ltlsim model and returns a pointer to the model
 *
 * \returns The new ltlsim model
 */
ltlsim_model_t *initLTLSimModel();

/** \brief Set the trace length of a ltlsim model.
 *
 * \param m A pointer to the ltlsim model.
 * \param tl The trace length.
 */
void setTraceLength(ltlsim_model_t *m, unsigned int tl);

/** \brief Add an atomic to a ltlsim model.
 *
 * \param m A pointer to the ltlsim model.
 * \param id The id of the new atomic.
 */
void addAtomic(ltlsim_model_t *m,  const char *id);

/** \brief Add a formula to a ltlsim model.
 *
 * \param m A pointer to the ltlsim model.
 * \param id The id of the new formula.
 * \param expr The expression of the new formula.
 */
void addFormula(ltlsim_model_t *m,  const char *id, const char *expr);

/** \brief Set the trace of an atomic.
 *
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the atomic in the ltlsim model atomics collection.
 * \param trace The trace.
 * \param tl the trace length.
 */
void setAtomicTrace(ltlsim_model_t *m, unsigned int idx, const bool trace[], unsigned int tl);

/** \brief Set the trace of a formula.
 *
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param trace The trace.
 * \param tl the trace length.
 */
void setFormulaTrace(ltlsim_model_t *m, unsigned int idx, const bool trace[], unsigned int tl);

/** \brief Set the trace of an atomic at a given time index.
 *
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the atomic in the ltlsim model atomics collection.
 * \param tidx The index where the trace should be set.
 * \param v The new value.
 */
void setAtomicTraceAt(ltlsim_model_t *m, unsigned int idx, unsigned int tidx, bool v);

/** \brief Set the trace of a formula at a given time index.
 *
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param tidx The index where the trace should be set.
 * \param v The new value.
 */
void setFormulaTraceAt(ltlsim_model_t *m, unsigned int idx, unsigned int tidx, bool v);

/** \brief Set the trace length of an atomic.
 *
 * If the new trace length is greater than the old trace length, the atomics trace
 * is padded with zeros.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the atomic in the ltlsim model atomics collection.
 * \param tl The trace length.
 */
void setAtomicTraceLength(ltlsim_model_t *m, unsigned int idx, unsigned int tl);

/** \brief Set the trace length of a formula.
 *
 * If the new trace length is greater than the old trace length, the atomics trace
 * is padded with zeros.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param tl The trace length.
 */
void setFormulaTraceLength(ltlsim_model_t *m, unsigned int idx, unsigned int tl);

/** \brief Set the expression of a formula.
 *
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param expr The new expression.
 */
void setFormulaExpression(ltlsim_model_t *m, unsigned int idx, const char *expr);

/** \brief Print information related to an atomic.
 *
 * If an index < 0 is specified, all atomics of the model are printed.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the atomic in the ltlsim model atomics collection.
 * \param out The output stream the output should be directed to.
 */
void printAtomic(ltlsim_model_t *m, int idx, FILE *out);

/** \brief Print information related to  a formula.
 *
 * If an index < 0 is specified, all formulas of the model are printed.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param out The output stream the output should be directed to.
 */
void printFormula(ltlsim_model_t *m, int idx, FILE *out);

/** \brief Print the trace of an atomic.
 *
 * If an index < 0 is specified, all the traces of all atomics of the model
 * are printed, identified by the atomic ids.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the atomic in the ltlsim model atomics collection.
 * \param out The output stream the output should be directed to.
 */
void printAtomicTrace(ltlsim_model_t *m, int idx, FILE *out);

/** \brief Print the trace of a formula.
 *
 * If an index < 0 is specified, all the traces of all formula of the model
 * are printed, identified by the atomic ids.
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula in the ltlsim model formulas collection.
 * \param out The output stream the output should be directed to.
 */
void printFormulaTrace(ltlsim_model_t *m, int idx, FILE *out);

/** \brief Print information related to an ltlsim model.
 *
 * This shows the atomics and formulas of the models, as well as all traces.
 * \param m A pointer to the ltlsim model.
 * \param out The output stream the output should be directed to.
 */
void printModel(ltlsim_model_t *m, FILE *out);

/** \brief Find an atomic by its id.
 *
 * This finds an atomic by its id in the given ltlsim model and returns
 * a pointer to the atomic if successfull. Otherwise NULL is returned.
 * \param m A pointer to the ltlsim model.
 * \param id The id to look for.
 * \returns A pointer to the atomic or NULL.
 */
atomic_t *getAtomic(ltlsim_model_t *m, const char *id);

/** \brief Find a formula by its id.
 *
 * This finds an formula by its id in the given ltlsim model and returns
 * a pointer to the formula if successfull. Otherwise NULL is returned.
 * \param m A pointer to the ltlsim model.
 * \param id The id to look for.
 * \returns A pointer to the formula or NULL.
 */
formula_t *getFormula(ltlsim_model_t *m, const char *id);

/** \brief Get the index of an atomic by its id.
 *
 * This finds an atomic by its id in the given ltlsim model and returns
 * its index in the ltlsim model atomics collection if successfull.
 * Otherwise -1 is returned.
 * \param m A pointer to the ltlsim model.
 * \param id The id to look for.
 * \returns The index of the atomic or -1.
 */
int getAtomicIdx(ltlsim_model_t *m, const char *id);

/** \brief Get the index of a formula by its id.
 *
 * This finds a formula by its id in the given ltlsim model and returns
 * its index in the ltlsim model formulas collection if successfull.
 * Otherwise -1 is returned.
 * \param m A pointer to the ltlsim model.
 * \param id The id to look for.
 * \returns The index of the formula or -1.
 */
int getFormulaIdx(ltlsim_model_t *m, const char *id);

#endif
