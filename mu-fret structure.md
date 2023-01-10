---
title: Mu-FRET Structure
author: Matt Luckcuck
date: 2023
---

# Mu-FRET Structure
#### Matt Luckcuck 2023

Inside the Mu-FRET repository, you'll find the following (incomplete) directory structure. This highlights the main directories and the additions in comparison with FRET.

* `executables`

* `fret-election` – Root directory for the electron application

  * `analysis`
  * `app` – Contains most of the FRET application
    * `actions`
    * `components` – Contains the various React components that make up the GUI/functionality
      * `refactoring` -- Contains `RefactorRequirementDialog.js`, which is the React component that controls the refactoring GUI
    * `containers`
    * `parser`
    * `reducers`
    * `store`
    * `utils`
  * `docs`
  * `flow-typed`
  * `internals`
  * `resources`
  * `support`
  * `templates`
  * `test`

* `tools` – Contains external tools or functionality that has been included in FRET
  * `Refactoring` -- Contains the back-end files for the refactoring functionality

* `tutorialExamples` – Contains example FRET project(s)


The two directories that are new to Mu-FRET (in comparison to FRET) are `fret-election/app/components/refactoring` and `tools/Refactoring`.

As mentioned in the directory structure list above, `fret-election/app/components/refactoring` contains `RefactorRequirementDialog.js` -- which provides the front-end (GUI), but also (unfortunately) does much messing with the databases too. This seems to be partly a quirk of Electron/React, I think.

The `tools/Refactoring` directory's four main files are:
* `refactoring_compare.js` -- Contains the logic for comparing the old and new requirements (adapted from `fret-election/test/semantics/CallNuSMV.js`);
* `refactoring_controller.js` -- Controls the interaction between the front-end and the lower-level functions in `refactoring_model.js`;
* `refactoring_model.js` -- Contains the lower-level functions for manipulating the 'data model' (the requirements, etc);
* `refactoring_utils.js` -- Contains utilities that might be reused across the refactoring functionality.
