/** \file ltlsim_smvutils_private.h
 *  Private functions for the creation of smv input and calling the NuSMV executable.
 */

#ifndef LTLSIM_SMVUTILS_PRIVATE_H
#define LTLSIM_SMVUTILS_PRIVATE_H

#include <stdio.h>
#include "ltlsim_types.h"

/** \brief Private function to create a finite state machine from a ltlsim model.
 *
 * This function creates a finite state machine (FSM) in smv format from the given ltlsim model.
 * The FSM consists of a single state `t` representing the time step, output definitions, which
 * define the values of the models atomic traces depending on `t` and LTL specifications representing
 * the formula specified by the index `idx`. If `idx` is -1, specifications for all formulas are created.
 * If the flag `doTrace` is `false` only the plain specification is generated, otherwise, additional
 * specifications representing the valuation of the formula for the different time points are also created.
 *
 * \param m The ltlsim model, from the FSM is generated.
 * \param idx Index of the formula which should be represented as `LTLSPEC`.
 * \param fn The file name, where the smv model is saved.
 * \param doTrace A flag indicating whether time traces should be computed, or the formula should only be evaluated globally.
 */
static int _genFSM(ltlsim_model_t *m, int idx, const char *fn, bool doTrace);

/** \brief Private function to generate the state definition in a FSM.
 *
 * \param fp Pointer to the file to write the FSM state definition.
 * \param tmax Final time point.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _genState(FILE *fp, unsigned int tmax);

/** \brief Private function to generate the trace definition in a FSM.
 *
 * \param fp Pointer to the file to write the FSM state definition.
 * \param m The ltlsim model.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _genTrace(FILE *fp, ltlsim_model_t *m);

/** \brief Private function to generate the specification definition in a FSM.
 *
 * \param fp Pointer to the file to write the FSM state definition.
 * \param m The ltlsim model.
 * \param idx Index of the formula which should be represented as `LTLSPEC`.
 * \param doTrace A flag indicating whether time traces should be computed, or the formula should only be evaluated globally.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _genSpec(FILE *fp, ltlsim_model_t *m, int idx, bool doTrace);

/** \brief Private function to generate the specification definition for a single formula.
 *
 * \param fp Pointer to the file to write the FSM state definition.
 * \param f Pointer to the formula for which the specification is generated.
 * \param doTrace A flag indicating whether time traces should be computed, or the formula should only be evaluated globally.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _genFormulaSpec(FILE *fp, formula_t *f, bool doTrace);

/** \brief Private function to call nusmv and apply the results the ltlsim model.
 *
 * \param m Pointer to the ltlsim model.
 * \param idx Index of the formula which should be represented as `LTLSPEC`.
 * \param fn The file name, where the smv model was previously saved.
 * \param doTrace A flag indicating whether time traces should be computed, or the formula should only be evaluated globally.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _callSMV(ltlsim_model_t *m, int idx, const char *fn, bool doTrace);

/** \brief Private function to remove the smv file.
 *
 * \param fn The file name of the smv model which should be removed.
 * \returns The exit status. -1 in the case of failure and 0 otherwise.
 */
static int _rmFSM(const char *fn);

/** \brief Private function to remove FTP and LAST from the formula for the overall evaluation
 *
 * \param f_expr: buffer to write modified formula (provided)
 * \param expr: original formula
 * \returns N/A
 */
static void _prepFormula(char *f_expr, const char *expr);
#endif
