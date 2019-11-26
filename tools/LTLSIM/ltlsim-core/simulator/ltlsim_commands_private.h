/** \file ltlsim_commands_private.h
 * Private functions for ltlsim command line and batch mode.
 * 
 */

#ifndef LTLSIM_COAMMNDS_PRIVATE_H
#define LTLSIM_COAMMNDS_PRIVATE_H

#include "ltlsim_types.h"

static char *_getSym(char **);
static void _stripCtrlCharacters(char *);
static int _checkArgId(char *);
static int _checkArgTrace(char *);
static int _execCommandsCommand(void);
static int _execAddAtomicCommand(ltlsim_model_t *, char **, unsigned int);
static int _execAddFormulaCommand(ltlsim_model_t *, char **, unsigned int);
static int _execSetAtomicCommand(ltlsim_model_t *, char **, unsigned int);
static int _execSetFormulaCommand(ltlsim_model_t *, char **, unsigned int);
static int _execAnalyseFormulaCommand(ltlsim_model_t *, char **, unsigned int);
static int _execAnalyseModelCommand(ltlsim_model_t *, char **, unsigned int);
static int _execSetTracelengthCommand(ltlsim_model_t *, char **, unsigned int);
static int _execPrintModelCommand(ltlsim_model_t *, FILE *);
static int _execPrintAtomicCommand(ltlsim_model_t *, char **, unsigned int, FILE *);
static int _execPrintFormulaCommand(ltlsim_model_t *, char **, unsigned int, FILE *);
static int _execPrintAtomicTraceCommand(ltlsim_model_t *, char **, unsigned int, FILE *);
static int _execPrintFormulaTraceCommand(ltlsim_model_t *, char **, unsigned int, FILE *);

#endif