Mu-FRET
=============================================

Introduction
------------

Mu-FRET is a fork of the [Formal Requirements Elicitation Tool (FRET)](https://github.com/NASA-SW-VnV/fret) by a team who started at Maynooth University, Ireland. It was created within Use Case 5 of the [Verification and Validation of Automated Systems’ Safety and Security (VALU3S)](https://valu3s.eu/) project. 

FRET is a framework for the elicitation, specification, formalisation and understanding of requirements. It was developed by a Software Verification and Validation team at NASA. In FRET,  users enter system requirements in a structured natural language called FRETISH. FRET automatically translates FRETISH requirements into Past- and Future-Time Metric Temporal Logic.

Mu-FRET extends FRET by adding refactoring functionality. Refactoring, when applied to software, is the process of rearranging the software's internal structure without changing its external behaviour. This is helpful for the maintainability of software, and has similar benefits for requirements.

Mu-FRET enables a user to extract parts of a requirement to a new requirement, allowing the extracted part to be reused. Mu-FRET also formally verifies that the refactored requirement (including the extracted parts) has the same behaviour as the original requirement. This gives confidence that the tool has not inadvertently introduced new (possibly incorrect) behaviour.

## Mu-FRET Team

* [Matt Luckcuck](https://orcid.org/0000-0002-6444-9312)
* [Oisín Sheridan](https://orcid.org/0000-0002-8613-2500)
* [Marie Farrell](https://orcid.org/0000-0001-7708-3877)
* [Rosemary Monahan](https://orcid.org/0000-0003-3886-4675)

## Presentations Posters and Videos

Our team have given several presentations about both FRET and Mu-FRET as part of the VALU3S project, and produced posters for project demonstration sessions. Below you can find links to videos and slides from the presentations, and links to download the posters.


### Videos 
* [_Formalising Verifiable Requirements_](https://www.youtube.com/watch?v=FQGKbYCbxPY) (YouTube): a VALU3S training presentation covering our use of FRET to formalise the requirements of Use Case 5.

* [_Extract Requirement Demos_](https://github.com/valu3s-mu/demo-videos) (GitHub): a repository of videos demonstrating how Mu-FRET's Extract Requirement refactoring works.


### Presentation Slides

* [_FRETing about Requirements: Formalised Requirements for an Aircraft Engine Controller_](mu-fret-docs/presentations/refsq2022-fret.pdf) (slides PDF): conference presentation about our work using FRET to formalise the requirements of an aircraft engine controller, provided by our Use Case 5 partner. The accompanying publication can be found on the [publisher's page](https://doi.org/10.1007/978-3-030-98464-9_9) or Open Access on [arXiv](https://arxiv.org/abs/2112.04251).
* [Demonstration Session slides](mu-fret-docs/presentations/goteburg-nuim.pdf) (PDF) from the General Assembly meeting in Gothenburg. These high-level slides gave us a visual aid while we were demonstrating progress using FRET and Mu-FRET in the VALU3S project. 
* [Demonstration Session slides](mu-fret-docs/presentations/hamburg-nuim.pdf) (PDF) from the General Assembly meeting in Hamburg, providing an update on the slides from the Gothenburg meeting. These high-level slides gave us a visual aid while we were demonstrating progress using FRET and Mu-FRET in the VALU3S project. 

### Posters

* [_Classical Formal Verification Driven by Formal Requirements_](mu-fret-docs/posters/NUIM-Classical_Formal_Verification_Driven_by_Formal_Requirements.pdf) (poster PDF): a poster from the VALU3S project that describes how our work combines FRET with several verification methods.
* [_Modular Formal Requirements-Driven Verification_](mu-fret-docs/posters/NUIM-Modular_Formal_Requirements-Driven_Verification.pdf) (poster PDF): a poster from the VALU3S project that describes Mu-FRET, explaining how we have improved FRET to enable it to perform refactoring.
* [_Refactoring Requirements and MU-FRET's Place in the VeRFoR Toolchain_](mu-fret-docs/posters/Refactoring_Requirements_and_MU-FRETs_Place_in_the_VeRFoR_Toolchain.pdf) (poster PDF): a poster from the VALU3S Summer School in 2023 which describes the purpose of refactoring in MU-FRET and locates it in toolchains used in VALU3S.
* [_Using Mu-FRET for Parent-Child Relationship, and comparisons with EARS_](mu-fret-docs/posters/Using_Mu-FRET_for_Parent-Child_Relationships_and_Comparisons_with_EARS.pdf) (poster PDF): a poster from the VALU3S Summer School in 2023 which showcases the MU-FRET user interface and contrasts FRET with a competing structured natural language for requirements elicitation, EARS.

## Papers

Our team has written several papers about our work for the VALU3S project using FRET and about building Mu-Fret.

### Mu-FRET Papers

* _Towards Refactoring FRETish Requirements_: A short paper that describes the motivations for adding refactoring behaviour to FRET, published at NFM 2022. The paper is available from the [publisher's page](https://link.springer.com/chapter/10.1007/978-3-031-06773-0_14) or Open Access via [arXiv](https://arxiv.org/abs/2201.04531)
* [_Why just FRET when you can Refactor? Retuning FRETISH Requirements_](https://arxiv.org/abs/2202.05816) (unpublished preprint): This preprint is a version of a paper describing a manual approach to refactoring requirements that are written in FRET's input language, FRETISH.

### Papers Using FRET

* _A Methodology for Developing a Verifiable Aircraft Engine Controller from Formal Requirements_: A short paper that describes the methodology for requirements engineering and verification that we used during the VALU3S project, published at the IEEE Aerospace Conference. Available: [https://ieeexplore.ieee.org/abstract/document/9843589](https://ieeexplore.ieee.org/abstract/document/9843589) and [https://arxiv.org/abs/2110.09277](https://arxiv.org/abs/2110.09277)

* _FRETting about Requirements: Formalised Requirements for an Aircraft Engine Controller_: A paper published at the REFSQ conference that describes our work using FRET to formalise the requirements of an aircraft engine controller, provided by our Use Case 5 partner. Available: [https://link.springer.com/chapter/10.1007/978-3-030-98464-9_9](https://link.springer.com/chapter/10.1007/978-3-030-98464-9_9) and [https://arxiv.org/abs/2112.04251](https://arxiv.org/abs/2112.04251). The [presentation](mu-fret-docs/presentations/refsq2022-fret.pdf) is also available.

* _A Requirements-Driven Methodology: Formal Modelling and Verification of an Aircraft Engine Controller_: a paper describing using Event-B to formalise and verify systems described using Simulink models, and how we can link this to requirements captured in FRET. Available: [https://link.springer.com/chapter/10.1007/978-3-031-07727-2_21](https://link.springer.com/chapter/10.1007/978-3-031-07727-2_21)


## The VALU3S Project

The work on Mu-FRET begain as part of the VALU3S project, information about which can be found in the project's [web-based repository](https://repo.valu3s.eu). As part of [Use Case 5](https://repo.valu3s.eu/use-cases/aircraft-engine-controller), we incorporated FRET into our requirements ellicitation process as part of a workflow called [VeRFoR: Verifying and Refactoring Formalised Requirements](https://repo.valu3s.eu/use-cases/aircraft-engine-controller/workflow/verfor). The repository contains further information on [Mu-FRET's place in the project](https://repo.valu3s.eu/tools/improved-developed-tool/mu-fret), and the [associated demonstration](https://repo.valu3s.eu/use-cases/demonstrators-evaluation-results-1/demo-6).


## Installation 

Mu-FRET is built on FRET, so installing Mu-FRET is the same procedure as for FRET but **NuSMV must be installed for Mu-FRET to work**. Below are the basic steps to install Mu-FRET, but for more detailed instructions, dependencies, and notes, please check the [FRET installation instructions](fret-electron/docs/_media/installingFRET/installationInstructions.md). If installing on Windows, see also the [Windows installation instructions](fret-electron/docs/_media/installingFRET/installation_windows.md)

### Mu-FRET Installation 

1. Install [NuSMV](https://nusmv.fbk.eu/) and make sure that it is on your system's path (this may require manually adding NuSMV's binary -- `bin` -- folder to your path, or setting an environmnet variable, etc. depending on your operating system). To check that NuSMV is installed corecctly for Mu-FRET, open a termina/command prompt and run `nusmv`. You should see something like:
```bash
*** This is NuSMV 2.6.0 (compiled on Wed Oct 14 15:36:56 2015)
*** Enabled addons are: compass
*** For more information on NuSMV see <http://nusmv.fbk.eu>
*** or email to <nusmv-users@list.fbk.eu>.
*** Please report bugs to <Please report bugs to <nusmv-users@fbk.eu>>

*** Copyright (c) 2010-2014, Fondazione Bruno Kessler

*** This version of NuSMV is linked to the CUDD library version 2.4.1
*** Copyright (c) 1995-2004, Regents of the University of Colorado

*** This version of NuSMV is linked to the MiniSat SAT solver. 
*** See http://minisat.se/MiniSat.html
*** Copyright (c) 2003-2006, Niklas Een, Niklas Sorensson
*** Copyright (c) 2007-2010, Niklas Sorensson

Input file is (null). You must set the input file before.

Aborting batch mode

NuSMV terminated by a signal

Aborting batch mode

```
2. Install [NodeJS](https://nodejs.org/en/download) 
3. Then, open a terminal/command prompt in the `fret-electron` of the Mu-FRET distribution and run `npm run fret-install` (or `npm run fret-reinstall` instead if you have previously installed Mu-FRET).


### Common Errors

As FRET and Mu-FRET are still very much in-development, there are a few issues that crop up with some regularity during installation. All commands listed here should be run from `/mu-fret/fret-electron` unless stated otherwise.

1. `Error: Cannot find module 'babel-register'`  
    This error is common, and is an issue with the FRET's dependencies. To fix this, uninstall the module to remove it from the dependencies, and install some replacements:  
    - ` npm uninstall babel-register --save-dev`  
    - ` npm install @babel/core @babel/register --save-dev`

2. You may encounter some errors regarding missing typefaces; specifically, the most common ones are `typeface-gloria-hallelujah`, `typeface-roboto` and `typeface-indie-flower`. To get around this, navigate to the /app folder and install them manually:
    - `cd app`
    - `npm install typeface-gloria-hallelujah`  
    (If you had errors for other typeface packages, install those the same way)
    - `cd ..` (to go back to fret-electron)

3. `npm ERR! Could not install from “node_modules\ejs-compiled-loader\ejs@git+https:\github.com\nemanjan00\ejs.git” as it does not contain a package.json file.`  
    This is a similar problem to the typeface errors, in that Node is just failing to install this package for some reason. Again, the solution is to install the package manually before attempting the Mu-FRET installation again:
    - `npm install ejs-compiled-loader`

4. `ValueError: invalid mode: 'rU' while trying to load binding.gyp`
    This is a problem with the version of Python being used. After trying to fix the problem by running `npm config set python python2.7.18` and installing [pyenv](https://github.com/pyenv/pyenv), we found that each was overridden by the version specified in the system's PATH variable and so it was necessary to add Python 2.7.18 there, above Python 3.x.


## Usage

To start using Mu-FRET, once it has been installed (see above) open a terminal/command prompt inside the `fret-electron` directory and run `npm start`.

Further information about the FRET/Mu-FRET user experience can be found in the [FRET User Manual](fret-electron/docs/_media/userManual.md).

### Assumptions

Mu-FRET is built with a few assumptions about requirements and usage, which we detail here.

#### Requirements Assumptions

* Requirements parse as valid FRETISH. This is to ensure that we get a translation of the requirement into temporal logic.
* Variable names are only repeated within the same component. 
* Variable names do not contain underscores. This is a requirement of NuSMV names, but FRET/Mu-FRET wont stop you from using them. 
* Requirements do not contain any SMV reserved keywords: `MODULE`, `DEFINE`, `MDEFINE`, `CONSTANTS`, `VAR`, `IVAR`, `FROZENVAR`, `INIT`, `TRANS`, `INVAR`, `SPEC`, `CTLSPEC`, `LTLSPEC`, `PSLSPEC`, `COMPUTE`, `NAME`, `INVARSPEC`, `FAIRNESS`, `JUSTICE`, `COMPASSION`, `ISA`, `ASSIGN`, `CONSTRAINT`, `SIMPWFF`, `CTLWFF`, `LTLWFF`, `PSLWFF`, `COMPWFF`, `IN`, `MIN`, `MAX`, `MIRROR`, `PRED`, `PREDICATES`, `process`, `array`, `of`, `boolean`, `integer`, `real`, `word`, `word1`, `bool`, `signed`, `unsigned`, `extend`, `resize`, `sizeof`, `uwconst`, `swconst`, `EX`, `AX`, `EF`, `AF`, `EG`, `AG`, `E`, `F`, `O`, `G`, `H`, `X`, `Y`, `Z`, `A`, `U`, `S`, `V`, `T`, `BU`, `EBF`, `ABF`, `EBG`, `ABG`, `case`, `esac`, `mod`, `next`, `init`, `union`, `in`, `xor`, `xnor`, `self`, `TRUE`, `FALSE`, `count`, `abs`, `max`, `min`. This is another requirement of NuSMV. FRET/Mu-FRET will not stop you from using them but if you run FRET/Mu-FRET in developer mode (`npm run dev`) the console will show errors if requirements use these keywords.

#### Usage Assumptions


* The behaviour to be extracted from a requirement (a _fragment_) must have the same spacing in all the requirements that contain them, or Mu-FRET wont match them. E.g. If you extract "`the_var = 2`" from requirement A and the same behaviour is written "`the_var=2`" in requirement B, then the behaviour will not be extracted from requirement B. 
* Requirements only use  Boolean or Integer variables.
  - Unsigned Integers will be treated as Integers – this is consistent with FRET's approach to exporting requirements to CoCo Spec, where any integer (signed or unsigned) in Simulink will become an integer variable in CoCo Spec/Lustre.
  - Single and Double variables cannot be supported, even though FRETISH allows direct comparisons to real numbers (e.g. `variable > 2.4`) NuSMV does not support `real constants`.
  - The Mu-FRET refactoring UI warns users about these problems if variables have already been assigned an unsupported type.
