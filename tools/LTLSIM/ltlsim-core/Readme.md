# ltlsim-core

The `ltlsim-core` package provides javascript functions for the interactive simulation of linear temporal logic (LTL) formulas.

  * The core functions are implemented by the C program included in `ltlsim-core\simulator`. This tool also comes with a simple command line interface and a batch processing mode, for details check out the [Doxygen](simulator/doc/html/index.html).

  > __Note:__ The automatically generated doxygen files are not included in the repository. To create them locally run `doxygen Doxyfile` in the `ltlsim-core/simulator` directory (to download doxygen visit http://www.doxygen.nl/).

  * The exported function `ltlsim` (defined in `ltlsim-core\simulator\ltlsim_node.js`) provides a Javascript wrapper for the C core functions.
  * The directory `ltlsim-core\classes` includes a set of classes for the handling of data associated with the simulation.



## Installation

Please add `PATH_TO_FRET/fret/tools/LTLSIM/ltlsim-core/simulator` to the PATH environment variable.

#### Using npm

```npm install```

> __Note:__ When installing `ltlsim-core` as a dependency to an electron app following the [two package.json structure](https://github.com/electron-react-boilerplate/electron-react-boilerplate/wiki/Module-Structure----Two-package.json-Structure), `ltlsim-core` should be installed under the `.\app` directory, as it relies on the ltlsim executable to be bundled with the app.

> __Note:__ In the current FRET repository structure, `ltlsim-core` can be installed as a local dependency by including `"ltlsim-core": "file:../../tools/LTLSIM/ltlsim-core"` under dependencies in the `package.json` in the folder `fret-electron\app`.

> __Note:__ When integrating `ltlsim-core` into FRET, make sure that the ltlsim executable is available. The `package.json` of `ltlsim-core` is configured to automatically build the executable. However, for reasons currently unknown this works only when explicitly installing the package using `npm install ../../tools/LTLSIM/ltlsim-core` under the `fret-electron\app` directory (a simple `npm install` strangely does not build the executable)

> __Note:__ The `ltlsim-electron` app, as well as the ltlsim plugin in `fret-electron` require that the directory where the `ltlsim` executable is located is added to the `PATH` environment variable.

#### Alternative

In the `ltlsim-core\simulator` directory, run `make`.

#### Validating your installation

  * To test the `ltlsim` executable and your NuSMV installation run `ltlsim -c`. The following output should appear:

    ```
    [LTLSIM] Up and running ...
    [NUSMV ] Up and running ...
    ```
  * To test the javascript wrapper run `node .\test\test_ltlsim.js` or run `npm run test` or `yarn test` if you are using yarn. The following output should appear:

    ```
    F1_1: ( G [0,4] hello )
    F1_2: ( F [0,2] world )
    F2 : 0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0 => FALSE
    ltlsim exited with code 0.
    F1 : 0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1 => FALSE
    F1 (F1_1) : 1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0 => TRUE
    F1 (F1_2) : 0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0 => FALSE
    ltlsim exited with code 0.
    ```

## Requirements

A NuSMV (see http://nusmv.fbk.eu/) installation is required to run the tool. The current version has been only tested with NuSMV 2.6.0.

> __Note:__ Make sure that the NuSMV binaries directory is added to the PATH environment variable.

## Simulation of LTL Expressions

#### Concepts

#### Compilation to smv models

## API

#### Javascript

> __Example:__ First, import the `ltlsim-core` modules:
> ```javascript
> const ltlsim = require('ltlsim-core').ltlsim;
> const LTLSimController = require('ltlsim-core').LTLSimController;
> const EFormulaStates = require('ltlsim-core').EFormulaStates;
> ```
> Initialize a new ltlsim model with a trace length of 10:
> ```javascript
> let model = LTLSimController.init(10);
> ```
>
> Add two formulas to the model:
> ```javascript
> LTLSimController.addFormula(model, "F1", "(G[0, 4] hello) -> (F[0, 2] world)");
> LTLSimController.addFormula(model, "F2", "H[0, 3] world ");
> ```
> The formulas are parsed, their subexpressions initialized and the atomics `hello` and `world` are added to the model. The following displays the subexpressions of formula `F1`:
> ```javascript
> LTLSimController.getFormula(model, "F1").subexpressions
>     .forEach((s) => {
>         console.log(`${s.id}: ${s.expression}`);
>     })
> ```
> This output shows the subexpressions of formula `F1`. Subexpressions are the subparts of the formula which are wrapped by parentheses.
> ```
> F1_1: ( G [0,4] hello )
> F1_2: ( F [0,2] world )
> ```
> Now set the atomic traces:
> ```javascript
> LTLSimController.setAtomicTrace(model, "hello", [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0]);
> LTLSimController.setAtomicTrace(model, "world", [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0]);
> ```
> The simulation routine applies the callbacks `onResult`, `onClose` and `onError`. We define the first to and leave the default value for `onError`:
> ```javascript
> const onResult = (id, sid, value, trace) => {
>     console.log(`${id}${sid ? ' ('+sid+')':''} : ${trace} => ${value ? "TRUE" : "FALSE"}`);
>     LTLSimController.setFormulaTrace(model, id, sid, trace);
>     LTLSimController.setFormulaValue(model, id, sid, value);
> }
>
> const onClose = (code) => {
>     console.log(`ltlsim exited with code ${code}.`);
> }
> ```
> The function `getFilter` creates a filter object for a given formula, which contains the formula and a selection of subexpressions to be simulated:
> ```javascript
> let filter = LTLSimController.getFilter(model, "F1", true);
> ```
> Finally the simulation can be called:
> ```javascript
> ltlsim.simulate(model, filter, false, onResult, onClose);
> ltlsim.simulate(model, "F2", false, onResult, onClose);
> ```
> This results in the following output:
> ```
> F2 : 0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0 => FALSE
> ltlsim exited with code 0.
> F1 : 0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1 => FALSE
> F1 (F1_1) : 1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0 => TRUE
> F1 (F1_2) : 0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0 => FALSE
> ltlsim exited with code 0.
> ```


#### C

The underlying `ltlsim` C program exposes a basic C API. Check out the [doxygen](simulator/doc/html/index.html) for details.
