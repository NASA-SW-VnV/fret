/** \file ltlsim_types_private.h
 *  Private functions for creation and modification of ltlsim models.
 * 
 */

#ifndef LTLSIM_TYPES_PRIVATE_H
#define LTLSIM_TYPES_PRIVATE_H

#include <stdio.h>
#include "ltlsim_types.h"

/** \brief Private function to set an atomics id.
 * 
 * \param a A pointer to the atomic.
 * \param id The new id.
 */
static void _setAtomic(atomic_t *a, const char *id);

/** \brief Private function to set a formulas id and expression.
 * 
 * \param f A pointer to the formula.
 * \param id The new id.
 * \param expr The new expression.
 */
static void _setFormula(formula_t *f, const char *id, const char *expr);

/** \brief Private function to set an atomics trace.
 * 
 * \param a A pointer to the atomic.
 * \param trace The new trace.
 * \param tl The trace length.
 */
static void _setAtomicTrace(atomic_t *a, const bool trace[], unsigned int tl);

/** \brief Private function to set a formulas trace.
 * 
 * \param f A pointer to the formula.
 * \param trace The new trace.
 * \param tl The trace length.
 */
static void _setFormulaTrace(formula_t *f, const bool trace[], unsigned int tl);

/** \brief Private function to set an atomics trace at a given time index.
 * 
 * \param a A pointer to the atomic.
 * \param idx The index where the trace should be set.
 * \param v The new value.
 */
static void _setAtomicTraceAt(atomic_t *a, unsigned int idx, bool v);

/** \brief Private function to set a formulas trace at a given time index.
 * 
 * \param f A pointer to the formula.
 * \param idx The index where the trace should be set.
 * \param v The new value.
 */
static void _setFormulaTraceAt(formula_t *f, unsigned int idx, bool v);

/** \brief Private function to set an atomics trace length.
 * 
 * \param a A pointer to the atomic.
 * \param tl The new trace length.
 */
static void _setAtomicTraceLength(atomic_t *a, unsigned int tl);

/** \brief Private function to set a formulas trace length.
 * 
 * \param f A pointer to the formula.
 * \param tl The new trace length.
 */
static void _setFormulaTraceLength(formula_t *f, unsigned int tl);

/** \brief Private function to print information related to an atomic.
 * 
 * \param a A pointer to the atomic.
 * \param out The output stream the output should be directed to.
 */
static void _printAtomic(atomic_t *a, FILE *out);

/** \brief Private function to print information related to a formula.
 * 
 * \param f A pointer to the formula.
 * \param out The output stream the output should be directed to.
 */
static void _printFormula(formula_t *f, FILE *out);

/** \brief Private function to print all atomics of a model.
 * 
 * \param m A pointer to the ltlsim model.
 * \param out The output stream the output should be directed to.
 */
static void _printAtomics(ltlsim_model_t *m, FILE *out);

/** \brief Private function to print all formulas of a model.
 * 
 * \param m A pointer to the ltlsim model.
 * \param out The output stream the output should be directed to.
 */
static void _printFormulas(ltlsim_model_t *m, FILE *out);

/** \brief Private function to print all atomic traces of a model.
 * 
 * \param m A pointer to the ltlsim model.
 * \param out The output stream the output should be directed to.
 */
static void _printAtomicTraces(ltlsim_model_t *m, FILE *out);

/** \brief Private function to print all formula traces of a model.
 * 
 * \param m A pointer to the ltlsim model.
 * \param out The output stream the output should be directed to.
 */
static void _printFormulaTraces(ltlsim_model_t *m, FILE *out);

/** \brief Private function to print a trace
 * 
 * \param t A pointer to the trace.
 * \param out The output stream the output should be directed to.
 */
static void _printTrace(trace_t *t, FILE *out);

#endif