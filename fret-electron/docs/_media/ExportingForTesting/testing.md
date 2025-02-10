# Exporting Test Obligations
Given a FRETish requirement, FRET can generate formulas commonly referred to as test obligations. The obligations aim to expose how individual variables in a requirement uniquely affect its validity. In other words, the obligations define a measure of the input requirement's coverage.

Currently, this feature is supported for the connection between FRET and the Requirements-based Testing framework in CoCoSim. Test obligations are generated from the past-time formula variant of a FRETish requirement and subsequently translated into Lustre, using the CoCoSpec format.

A step-by-step guide on how to generate CoCoSpec test obligations is shown below.

