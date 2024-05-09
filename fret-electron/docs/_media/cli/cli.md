# FRET Command Line Interface (CLI)

The FRET CLI was created to provide means of access to FRET features using a command-line application. The following features are available:

1. See list of projects in the database and system components in a specified project.
2. Perform realizability checking of a system component and diagnosis of unrealizable components. All of the configuration options that are available in FRET area also available for use here (e.g. compositional realizability checking, engine options, saving reports).
3. Output the metric temporal logic formula of choice, for a valid FRETish input.

> [!NOTE]
> In order to use the realizability checking feature, additional installation of dependencies is required. See the [realizability checking manual](../exports/realizabilityManual.md#dependencies) for further details.

## Usage

Users have full access to the CLI using the following command under `fret/fret-electron`:

```
npm run start-cli
```

Some commands provide additional options (for example `-l` in `formalize` command). To pass these options to the the CLI app, instead of node, the command above must be slightly adjusted to

```
npm run start-cli --
```

> [!TIP]
> In order to minimize the required command's length, we recommend using the provided `sh` script under `fret/tools/Scripts/cli/fretcli`. Further modification of the script is required before it can be used. See the [script content](../../../../tools/Scripts/cli/fretcli) for further details.


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


## Realizability checking
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

An example run of the `realizability` command is shown below (the `--silent` option is used to supress output related to NodeJS).

```
fret/fret-electron$ npm run --silent start-cli -- realizability --solver jkind --diagnose --timeout 200 Liquid_mixer liquid_mixer
Checking realizability for Liquid_mixer:liquid_mixer...

Specification is unrealizable.
Diagnosing unrealizable connected component: cc2 ...
Result: UNREALIZABLE
Number of connected components (cc): 6
┌─────────┬────────────────┬──────────┐
│ (index) │     Result     │   Time   │
├─────────┼────────────────┼──────────┤
│   cc0   │  'REALIZABLE'  │ '0.659s' │
│   cc1   │  'REALIZABLE'  │ '0.81s'  │
│   cc2   │ 'UNREALIZABLE' │ '0.609s' │
│   cc3   │  'REALIZABLE'  │ '0.998s' │
│   cc4   │  'REALIZABLE'  │ '0.904s' │
│   cc5   │  'REALIZABLE'  │ '1.058s' │
└─────────┴────────────────┴──────────┘

Diagnosis results for connected component cc2:
┌────────────┬──────────────────────┐
│  (index)   │     Requirements     │
├────────────┼──────────────────────┤
│ Conflict 1 │ [ 'LM001', 'LM009' ] │
└────────────┴──────────────────────┘
```

## Generating formalizations
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

An example run using the `formalize` command can be seen below.

```
fret/fret-electron$ npm run --silent start-cli -- formalize -l ft-fin 'sw shall within 500 ticks satisfy x'

((F[0,500] x) | (F[0,499] LAST))

```

[Back to FRET home page](../userManual.md)

[Back to the FRET README](../../../../README.md)
