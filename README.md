Mu-FRET
=============================================

Introduction
------------

Mu-FRET is a fork of the Formal Requirements Elicitation Tool (FRET) by a team at Maynooth University, Ireland.

FRET is a framework for the elicitation, specification, formalisation and understanding of requirements. It was developed by a Software Verification and Validation team at NASA. In FRET,  users enter system requirements in a structure natural language called FRETISH. FRET automatically translates FRETISH requirements to past- and future-time metric temporal logic.

Mu-FRET extends FRET by adding refactoring functionality. Refactoring, when applied to software, is the process of rearranging the software's internal structure without changing its external behaviour. This is helpful for the maintainability of software, and has similar benefits for requirements.


Mu-FRET enables a user to extract parts of a requirement to a new requirement, allowing the extracted part to be reused. Mu-FRET also formally verifies that the refactored requirement (including the extracted parts) has the same behaviour as the original requirement. This gives confidence that the tool has not inadvertently introduced new (possibly incorrect) behaviour.

## Installation 

Installing Mu-FRET is the same as installing FRET, so we include the [FRET installation instructions](fret-electron/docs/_media/installingFRET/installationInstructions.md)

## Publications Presentations and Posters

Our team have written several academic papers, given presentations, and made posters relating to Mu-FRET. For full details see our [publications, presentation, and posers list](mu-fret-docs/publications-presentations-posters.md)
