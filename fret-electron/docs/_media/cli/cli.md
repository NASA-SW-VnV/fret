# FRET Command Line Interface (CLI)

The FRET CLI was created to provide means of access to FRET features using a command-line application. The following features are available:

1. See list of projects in the database and system components in a specified project.
2. Perform realizability checking of a system component and diagnosis of unrealizable components. All of the configuration options that are available in FRET area also available for use here (e.g. compositional realizability checking, engine options, saving reports).
3. Output the metric temporal logic formula of choice, for a valid FRETish input.

## Installation

To enable access to the CLI, you need to build the corresponding component from source, using the following command under `fret/fret-electron`:

```
npm run build-cli
```

> [!NOTE]
> In order to use the realizability checking feature, additional installation of dependencies is required. See the [realizability checking manual](../exports/realizabilityManual.md#dependencies) for further details.

After the installation is completed, you have full access to the CLI using the command:

```
npm run start-cli
```

> [!TIP]
> In order to minimize the required command's length, we recommend using the provided `sh` script under `fret/tools/Scripts/cli/fretcli`. Further modification of the script is required before it can be used. See the [script content](../../../../tools/Scripts/cli/fretcli) for further details.

## Usage

The main list of commands are shown below.

```
fret/fret-electron$ npm run start-cli

Usage: fretcli [options] [command]

FRET Command Line Interface

Options:
  --debug                                        enable debugging output
  -h, --help                                     display help for command

Commands:
  list [project]                                 show list of projects, or system components of [project]
  realizability [options] <project> <component>  check realizability of a system component in the given project
  formalize [options] <fretish>                  returns specified formalization for valid FRETish sentences
  help [command]                                 display help for command
```

A detailed list of commands and options for the `realizability` command are shown below.

```
fret/fret-electron$ npm run start-cli help realizability

Usage: fretcli realizability [options] <project> <component>

check realizability of a system component in the given project

Arguments:
  project              target project
  component            target system component

Options:
  --solver [solver]    specify solver engine (kind2 or jkind). If unspecified, the first detected solver will be used
  --timeout [integer]  specify timeout (seconds) (default: 900)
  --diagnose           diagnose unrealizable requirements
  --json [file]        print results in JSON format in console or [file]
  -h, --help           display help for command
```

A detailed list of commands and options for the `formalize` command are shown below. The available `-l, --logic` values have the following meaning:

- `ft-inf`: Pure Future-time Metric Temporal Logic (Infinite Trace)
- `ft-fin`: Pure Future-time Metric Temporal Logic (Finite Trace)
- `pt`: Pure Past-time Metric Temporal Logic

```
fret/fret-electron$ npm run start-cli help formalize

Usage: fretcli formalize [options] <fretish>

returns specified formalization for valid FRETish sentences

Arguments:
  fretish                    FRETish sentence in single quotes (example: 'sw shall satisfy x')

Options:
  -l, --logic <value>        Formula logic (choices: "ft-inf", "ft-fin", "pt")
  -lang, --language <value>  Language for past-time (choices: "smv", "lustre")
  -h, --help                 display help for command
```