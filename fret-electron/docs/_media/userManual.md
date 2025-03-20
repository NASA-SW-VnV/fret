<!-- userManual.md -->

<img src="./icons/electric-guitar.png" height=25% width=100%>

# FRET: Formal Requirements Elicitation Tool

## Welcome to FRET!

FRET is a framework for the elicitation, specification, formalization and understanding of requirements. Users enter system requirements in a specialized natural language. FRET helps understanding and review of semantics by utilizing a variety of forms for each requirement: natural language description, formal mathematical logics, and diagrams. Requirements can be defined in a hierarchical fashion and can be exported in a variety of forms to be used by analysis tools.


* [Installing and Running FRET](./installingFRET/installationInstructions.md)
* [Developer's Guide](./developersGuide/installingAndRunningFRET.md)
* [FRETish grammar](./fretishGrammar/index.pdf)
* [FRET Graphical User Interface (GUI)](./user-interface/tutorial.md)
    * [Writing requirements](./user-interface/writingReqs.md)
    * [Importing requirements](./user-interface/exportImport/import.md)
    * [Exporting requirements](./user-interface/exportImport/export.md)
    * [Semantics](./semantics/semanticsOverview.md)
    * [Using the simulator](./UsingTheSimulator/ltlsim.md)
    * [Exporting for analysis](./ExportingForAnalysis/analysis.md)
    * [Realizability checking](./exports/realizabilityManual.md)
    * [Test Case Generation](./exports/testgenManual.md)
* [FRET Command Line Interface (CLI)](./cli/cli.md)
    * [Generating Formalizations](./cli/cli.md#Generating-formalizations)
    * [Realizability checking](./cli/cli.md#Realizability-checking)

#### FRET Example Requirements

We provide a set of example requirements that can be directly
[imported](./user-interface/exportImport/import.md) in FRET in the
[case studies directory](../../../caseStudies). The easiest example to start with is
[Finite State Machine](../../../caseStudies/FiniteStateMachine).

## FRET Team

[Andreas Katis](https://andreaskatis.github.io/),
[Anastasia Mavridou](http://amavridou.com/),
[Johann Schumann](https://ti.arc.nasa.gov/profile/schumann/).

*Alumni and Interns*: Milan Bhandari, David Bushnell, Tanja de Jong, Dimitra Giannakopoulou, Kelly Ho, George (Yorgo) Karamanolis, David Kooi, Daniel Mendoza, Jessica Phelan, Thomas Pressburger, Julian Rhein, Daniel Riley, Nija Shi, Khanh Trinh, Gricel Vazquez.
