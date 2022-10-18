MU-FRET
=============================================

Introduction
------------

MU-FRET is a fork of the Formal Requirements Elicitation Tool (FRET) by a team at Maynooth University, Ireland.

FRET is a framework for the elicitation, specification, formalisation and understanding of requirements. It was developed by a Software Verification and Validation team at NASA. In FRET,  users enter system requirements in a structure natural language called FRETISH. FRET automatically translates FRETISH requirements to past- and future-time metric temporal logic.

MU-FRET extends FRET by adding refactoring functionality. Refactoring, when applied to software, is the process of rearranging the software's internal structure without changing its external behaviour. This is helpful for the maintainability of software, and has similar benefits for requirements.

MU-FRET enables a user to extract parts of a requirement to a new requirement, allowing the extracted part to be reused. MU-FRET also formally verifies that the refactored requirement (including the extracted parts) has the same behaviour as the original requirement. This gives confidence that the tool has not inadvertently introduced new (possibly incorrect) behaviour.


