# Lockheed Martin Cyber-Physical Challenges

## Summary

This case study includes FRET requirements from the Ten Lockheed Martin Cyber-Physical Challenges. This case study has been used for the formal verification and requirements-based test case generation of the challenges' Simulink models using [CoCoSim](https://github.com/NASA-SW-VnV/cocosim).

The Simulink models are available here:

https://github.com/hbourbouh/lm_challenges

## References

Mavridou, Anastasia, Hamza Bourbouh, Dimitra Giannakopoulou, Thomas Pressburger, Mohammad Hejase, Pierre-Loic Garoche, and Johann Schumann.
[The ten lockheed martin cyber-physical challenges: formalized, analyzed, and explained](https://ieeexplore.ieee.org/abstract/document/9218211/), RE 2020.

## Instructions

The requirements in this case study can be exported into CoCoSpec specifications towards either formal verification or testing with CoCoSim.

To observe the CoCoSpec specifications, follow the steps below in FRET:

1. Import project `LM_requirements` by selecting the down arrow on the left and and navigating to `fret/caseStudies/LMCPS/LM_requirements.json`.

2. From the `Projects` pull down, select the `LM_requirements` project.

3. To view the requirements in tabular form: (on the left) click on the `Requirements` icon (three horizontal lines starting with dots). Browse the requirements listing.

4. Go to the Analysis Portal by clicking on `< >` (on the left).

5. Go to the Variable Mapping tab by clicking on `VARIABLE MAPPING`.
    * Click on each system component to see the variables used in the requirements.

6. To export in CoCoSpec format, follow these steps:
    * Select the `CoCoSpec` export language. 
    * Click on the `EXPORT` button to any of the available components (`NLGuidance` currently not supported for this step).
    * Select `Verification Code` to export the requirements in CoCoSpec format, to be used for formal verification, or `Test Obligations` to export the test obligations for each requirement, to be used for requirements-based testing.
    * In the File Explorer window, select a destination folder for the export. The requirements/test obligations are exported in a compressed (`.zip`) file.