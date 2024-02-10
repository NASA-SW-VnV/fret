/** \mainpage
 * 
 * \tableofcontents
 * 
 * \section LTLSIM
 * `ltlsim` is a command line tool for the interactive simulation of 
 * linear temporal logic (LTL) formulas against time traces. Formulas are 
 * expressions consisting of boolean operators, temporal operators and 
 * atomic propositions (called atomics in ltlsim). The tool uses NuSMV 
 * (see http://nusmv.fbk.eu/) for the simulation of the formulas, therefore 
 * the syntax for formula expressions is equivalent to the NuSMV syntax for
 * LTL specifications (see NuSMV User's Manual).
 * \subsection Installation 
 * Run `make` in the ltlsim sources directory.
 * 
 * \subsection Requirements
 * A NuSMV (see http://nusmv.fbk.eu/) installation is required to run the tool. 
 * The current version has been only tested with NuSMV 2.6.0. Make sure that the
 * NuSMV binaries directory is added to the `PATH` environment variable.
 * 
 * \subsection CLI Command Line Interface
 * `ltlsim` comes with a simple command line interface. 
 * It can be invoked by calling `ltlsim [options]`. 
 * The following command line options are provided:
 * 
 * Option    | Description
 * --------- | -----------
 * `-h`      | Show available options.
 * `-i`      | Interactive mode (default if no options are passed).
 * `-f file` | Read commands from `file` and operate in batch mode.
 * `-o file` | Write output to the specified file instead of the console.
 * `-c`      | Check nusmv installation.
 * 
 * In interactive and batch mode, the following commands are available:
 * 
 * Command               | Short Version | Parameters   | Description
 * --------------------- | ------------- | ------------ | -----------
 * `commands`            | `cmds`        |              | Display list of available commands.
 * `add-atomic`          | `adda`        | `id [trace]` | Add a new atomic with ID `id` and optionally `trace`. 
 * `add-formula`         | `addf`        | `id [expr]`  | Add a new formula with ID `id` and optionally expression `expr`.
 * `set-atomic`          | `seta`        | `id trace`   | Set the trace of the atomic with ID `id` to `trace`. A trace is specified as in add-atomic.
 * `set-formula`         | `setf`        | `id expr`    | Set the expression of the formula with ID `id` to `expr`.
 * `analyse-model`       | `anam`        |              | Analyse all formulas currently in the model.
 * `analyse-formula`     | `anaf`        | `id`         | Analyse the formula with ID `id`.
 * `set-tracelength`     | `sett`        | `tl`         | Set the model trace length to `tl`. This updates the traces of all atomics and formulas.
 * `print-model`         | `prtm`        |              | Print  the atomics, formulas and traces of the current model.
 * `print-atomic`        | `prta`        | `[id]`       | Print information for the atomic with ID `id`, or all atomics if no ID is specified.
 * `print-formula`       | `prtf`        | `[id]`       | Print information for the formula with ID `id`, or all formulas if no ID is specified.
 * `print-atomic-trace`  | `ptta`        | `[id]`       | Print the trace of the atomic with ID `id`, or of all atomics if no ID is specified.
 * `print-formula-trace` | `pttf`        | `[id]`       | Print the trace of the formula with ID `id`, or of all formulas if no ID is specified.
 * `exit`                | `exit`        |              | Display list of available commands.
 * 
 * A trace is specified by `(0|1)(0|1|\*)*`, where `*` will pad the trace to the current trace length with the last given value. Otherwise the trace is padded with `0`.
 * 
 * \subsection Example
 * 
 * Start ltlsim in interactive mode and enter the following input
 * ```
 * add-atomic a 0000000111000001011111111110101
 * add-atomic b 00000000001*
 * add-formula f1 G[0, 4] b -> a
 * add-formula f2 F[0, 4] !a
 * analyse-model
 * print-model
 * exit
 * ```
 * 
 * The following output is shown on the console:
 * ```
 * ATOMICS
 *  (0) <id: "a">
 *  (1) <id: "b">
 * FORMULAS
 *  (0) <id: "f1", expression: "G[0, 4] b -> a", value: 1>
 *  (1) <id: "f2", expression: "F[0, 4] !a", value: 1>
 * TRACES
 *  a:     0000000111000001011111111110101
 *  b:     0000000000111111111111111111111
 *  f1:    1111111111000001011111111110101 (1)
 *  f2:    1111111111111111100000011111110 (1)
 * ```
 * 
 * The `(1)` after the formula traces indicates the overall formula evaluation, 
 * which is valid in both cases. As an LTL expression holds, when it holds in 
 * the first state of a FSM, this is equivalent to the first trace value. 
 * 
 * To run `ltlsim` in batch mode, create a file `batch.ltl` with the contents
 * 
 * ```
 * add-atomic a 000000011110000000111111100000111
 * add-formula f H[0, 4] a
 * analyse-formula f
 * print-atomic-trace
 * print-formula-trace
 * exit
 * ```
 * 
 * and run `ltlsim -f batch.ltl -o batch.out`. The file `batch.out` then has following content:
 * 
 * ```
 *  a:	000000011110000000111111100000111
 *  f:	000000000000000000000011100000000 (0)
 * ```
 * 
 * \subsection API
 *   - The file ltlsim_types.h provides API functions for the creation 
 * and modification of a ltlsim model
 *   - The file ltlsim_commands.h provides functions for the processing 
 * of commands form the command line or a file
 *   - The file ltlsim_smvutils.h provides functions for the creation of smv models from ltlsim models, 
 * calling the NuSMV executable and creating traces from the counterexamples returned by NuSMV.
 */

/** \file ltlsim.c
 * The main file of the ltlsim tool.
 */
#include <stdio.h>
#include <stdlib.h>

#include "ltlsim_types.h"
#include "ltlsim_commands.h"
#include "ltlsim_smvutils.h"

char *nusmvBinaryName = "NuSMV";

/** \brief Print the help to the command line. 
 */
void print_help();

/** \brief Print an error indicating that no NuSMV installation is found. 
 */
void print_nusmv_error();

/** \brief LTLSIM main function.
 * 
 * The main function of the ltlsim tool. For a list of available command 
 * line options, call the program with the `-h` option. 
 * \returns The exit status. In the case of an error -1 is returned, otherwise 0 is returned.
 * */
int main(int argc, char *argv[])
{
    FILE *in = stdin;
    FILE *out = stdout;
    int argi, status = 0;
    bool infile = false;
    bool outfile = false;
    char cmd[MAX_COMMAND_LENGTH];

    if (argc > 1) {
        for (argi = 1; argi < argc; argi++) {
            if (!infile && !outfile) {
                if (strcmp(argv[argi], "-h") == 0) {
                    print_help();
                    return 0;
                } else if (strcmp(argv[argi], "-c") == 0) {
                    printf("[LTLSIM] Up and running ...\n");
                    status = checkNuSMVInstallation(false);
                    if (status) {
                        nusmvBinaryName = "nusmv";
                        status = checkNuSMVInstallation(false);
                        if (status) {
                            print_nusmv_error();
                            return -1;
                        } else {
                            printf("[NUSMV] Up and running ...\n");
                        }
                    } else {
                        printf("[NUSMV] Up and running ...\n");
                    }
                    return 0;
                } else if (strcmp(argv[argi], "-i") == 0) {
                    in = stdin;
                } else if (strcmp(argv[argi], "-f") == 0) {
                    if (argi < argc-1) {
                        infile = true;
                    } else {
                        fprintf(stderr, "[Error] No input file specified.\n");
                        status = -1;
                    }
                } else if (strcmp(argv[argi], "-o") == 0) {
                    if (argi < argc-1) {
                        outfile = true;
                    } else {
                        fprintf(stderr, "[Error] No output file specified.\n");
                        status = -1;
                    }
                } else {
                    fprintf(stderr, "[Error] Unknown command option %s.\n", argv[argi]);
                    status = -1;
                }
            } else {
                if (infile) {
                    in = fopen(argv[argi], "r");
                    if (in == NULL) {
                        fprintf(stderr, "[Error] Cannot open file %s.\n", argv[argi]);
                        status = -1;
                    } else {
                        infile = false;
                    }
                } else {
                    out = fopen(argv[argi], "w");
                    if (out == NULL) {
                        fprintf(stderr, "[Error] Cannot open file %s.\n", argv[argi]);
                        status = -1;
                    } else {
                        outfile = false;
                    }
                }
            }
        }
    }

    
    if (checkNuSMVInstallation(false)) {
        nusmvBinaryName = "nusmv";
        if (checkNuSMVInstallation(false)) {
            print_nusmv_error();
            status = -1;
        }
    } 

    if (status == 0) {
        ltlsim_model_t *model = initLTLSimModel();

        fgets(cmd, MAX_COMMAND_LENGTH, in);

        while(processCommand(model, cmd, out) ) {
            if (fgets(cmd, MAX_COMMAND_LENGTH, in) == NULL) break;
        }
    }

    fclose(in);
    fclose(out);

    return status;
}

void print_help() {
    printf("Usage: ltlsim [options]\n");
    printf("   options:\n");
    printf("   -h      Show this help.\n");
    printf("   -i      Interactive mode (default if no options\n");
    printf("           are passed).\n");
    printf("   -f file Read commands from file and operate\n");
    printf("           in batch mode.\n");
    printf("   -o file Write output to the specified file\n");
    printf("           instead of the console.\n");
    printf("   -c      Check nusmv installation.\n");
    printf("\n");
}

void print_nusmv_error() {
    printf("[Error] No NuSMV installation found. LTLSim requires \n");
    printf("[Error] a NuSMV (http://nusmv.fbk.eu/) installation to \n");
    printf("[Error] run. Make sure that the binaries direcory is \n");
    printf("[Error] set on the PATH environment variable.\n");
}