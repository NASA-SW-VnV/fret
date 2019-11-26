/** \file ltlsim_commands.h
 * Commands for ltlsim command line and batch mode.
 * 
 */

#ifndef LTLSIM_COMMANDS_H
#define LTLSIM_COMMANDS_H

#include <string.h>
#include <regex.h>
#include "ltlsim_types.h"
#include "ltlsim_smvutils.h"

#define MAX_ARGS 4
#define CMD_COMMANDS "commands"
#define CMD_ADD_ATOMIC "add-atomic"
#define CMD_ADD_FORMULA "add-formula"
#define CMD_SET_ATOMIC "set-atomic"
#define CMD_SET_FORMULA "set-formula"
#define CMD_ANALYSE_MODEL "analyse-model"
#define CMD_ANALYSE_FORMULA "analyse-formula"
#define CMD_SET_TRACELENGTH "set-tracelength"
#define CMD_PRINT_MODEL "print-model"
#define CMD_PRINT_ATOMIC "print-atomic"
#define CMD_PRINT_FORMULA "print-formula"
#define CMD_PRINT_ATOMIC_TRACE "print-atomic-trace"
#define CMD_PRINT_FORMULA_TRACE "print-formula-trace"
#define CMD_COMMANDS_SHORT "cmds"
#define CMD_ADD_ATOMIC_SHORT "adda"
#define CMD_ADD_FORMULA_SHORT "addf"
#define CMD_SET_ATOMIC_SHORT "seta"
#define CMD_SET_FORMULA_SHORT "setf"
#define CMD_ANALYSE_MODEL_SHORT "anam"
#define CMD_ANALYSE_FORMULA_SHORT "anaf"
#define CMD_SET_TRACELENGTH_SHORT "sett"
#define CMD_PRINT_MODEL_SHORT "prtm"
#define CMD_PRINT_ATOMIC_SHORT "prta"
#define CMD_PRINT_FORMULA_SHORT "prtf"
#define CMD_PRINT_ATOMIC_TRACE_SHORT "ptta"
#define CMD_PRINT_FORMULA_TRACE_SHORT "pttf"
#define CMD_COMMANDS_ARGS ""
#define CMD_ADD_ATOMIC_ARGS "id [trace]"
#define CMD_ADD_FORMULA_ARGS "id [expr]"
#define CMD_SET_ATOMIC_ARGS "id trace"
#define CMD_SET_FORMULA_ARGS "id expr"
#define CMD_ANALYSE_MODEL_ARGS ""
#define CMD_ANALYSE_FORMULA_ARGS "id"
#define CMD_SET_TRACELENGTH_ARGS "tl"
#define CMD_PRINT_MODEL_ARGS ""
#define CMD_PRINT_ATOMIC_ARGS "[id]"
#define CMD_PRINT_FORMULA_ARGS "[id]"
#define CMD_PRINT_ATOMIC_TRACE_ARGS "[id]"
#define CMD_PRINT_FORMULA_TRACE_ARGS "[id]"
#define CMD_EXIT "exit"

/** \brief Validate and execute a command, given as string, on the given ltlsim model. 
 * 
 * \param m A pointer to the ltlsim model.
 * \param cmdline One line read from the command input stream.
 * \param out A pointer to the stream where the command output should be directed.
 * \returns Exit status of the analysis. In the case of an error -1 is returned, otherwise 0 is returned.
 * 
 */
int processCommand(ltlsim_model_t *m, const char *cmdline, FILE *out);

#endif