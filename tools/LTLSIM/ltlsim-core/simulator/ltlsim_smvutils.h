/** \file ltlsim_smvutils.h
 *  Functions for the creation of smv input and calling the NuSMV executable.
 *  
 */

#ifndef LTLSIM_SMVUTILS_H
#define LTLSIM_SMVUTILS_H

#include <stdio.h>
#include <regex.h>
#include <string.h>
#include "ltlsim_types.h"


	//
	// name of shell variable for the name/path of the SMV binary
	//
#define LTLSIM_BINARY		"LTLSIM_BINARY"
extern char *nusmvBinaryName;

#define SMV_BUFFER 4096 //!< Length of the buffer for writing commands to call NuSMV and reading the NuSMV output 

/** \brief Analyze a single formula or the entire ltlsim model.
 * 
 * This function can be called to analyze a single formula or all formulas of the specified ltlsim model. 
 * To analyze all formulas, an index of -1 must be specified. 
 *  - If only a single formula is evaluated, a file
 * `<id>.smv` is created in the `./tmp/` directory, which contains the smv translation of the traces specified 
 * by the models atomics and LTL specifications corresponding to the formula. If the `doTrace` flag is false,
 * this is only a single specification of the form `LTLSPEC NAME <id> := <expr>`, where `<id>` is the formulas id
 * and `<expr>` is the formulas expression. Otherwise `n` additional specifications of the form 
 * `LTLSPEC NAME <id>_t<i> := G ((t = <i>) -> (<expr>)` are created, where `n` is the trace length of the model and
 * `<i>` is a running time index (i.e. `0 <= <i> < n`).
 *  - If all formulas are evaluated, a single file `tmp.smv` is created in the `./tmp/` directory, which contains the
 * smv translation for the traces and all formulas of the model.
 * 
 * \param m A pointer to the ltlsim model.
 * \param idx The index of the formula to be analyzed in the ltlsim model formulas collection.
 * \param doTrace A flag indicating whether time traces should be computed, or the formula should only be evaluated globally.
 * \returns Exit status of the analysis. In the case of an error -1 is returned, otherwise 0 is returned.
 */
int ltlsim_analyse(ltlsim_model_t *m, int idx, bool doTrace);

/** \brief Try whether the NuSMV executable can eb called successfully.
 * 
 * This calls nusmv with the `-h` option and returns the exit value. 
 * If the `doPrint` flag is `true` the output of the call is printed 
 * to `stdout`, appended by `[NUSMV]`.
 * 
 * \param doPrint Flag indicating whether the output of the call to nusmv should by printed.
 * \returns The exit value of the call to nusmv.
 * 
 */
int checkNuSMVInstallation(bool doPrint);

#endif
