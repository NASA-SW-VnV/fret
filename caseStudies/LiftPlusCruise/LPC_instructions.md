# Lift-Plus-Cruise

## Prerequisites

z3 and the JKind engine which can compute realizable traces. See
[Realizability
Dependencies](../../fret-electron/docs/_media/exports/realizabilityManual.md).


## References

* Thomas Pressburger, Andreas Katis, Aaron Dutle, Anastasia Mavridou.
[Authoring, Analyzing, and Monitoring Requirements for a Lift-Plus-Cruise Aircraft](https://link.springer.com/chapter/10.1007/978-3-031-29786-1_21),
REFSQ 2023.

* Thomas Pressburger, Andreas Katis, Aaron Dutle, Anastasia Mavridou.
[Using FRET to Create, Analyze and Monitor Requirements for a Lift Plus Cruise Case Study](https://ntrs.nasa.gov/api/citations/20220017032/downloads/TechnicalReport_Lift_Plus_Cruise_FRET_case_study%20(4).pdf),
NASA/TM–20220017032, April 2023.

## Instructions

1. Import project `LPC_mini` by selecting the down arrow on the left and navigating to `fret/caseStudies/LiftPlusCruise/LPC_mini_reqts_and_vars.json`.

2. From the `Projects` pull down, select the `LPC_mini` project.

3. To view the requirements in tabular form: (on the left) click on the
   `Requirements` icon (three horizontal lines starting with dots). Browse
   the requirements listing.
   
4. Go to the Analysis Portal by clicking on `< >` (on the left).

5. Go to the Variable Mapping tab by clicking on `VARIABLE MAPPING`.
    * Click `vehicle` to see the variables used in the requirements.

6. Go to the Realizability tab by clicking on `REALIZABILITY`. 

7. From the `ACTIONS` menu, select `Change Settings`
   1. Select `JKind` as Engine.
   2. Set `Example trace length` to 13.
   3. Click `Realizability Settings >` to close the menu.

8. Pull down `System Component*` and select `vehicle`.

**Realizable requirement subset**

9. Click the checkbox next to `LPC_reach_hover_06` to deselect it, then click `Apply`.

10. From the `ACTIONS` menu, select `Check Realizability`.

     * After some time FRET will indicate the requirements set is realizable by displaying a circled green check mark next to `vehicle`.

11. From the `ACTIONS` menu, select `Simulate Realizable Requirements` whereupon traces will be displayed. 
     * Notice that `kias` decreases from its initial value of 120 to below 20 and `hover_control_mode` becomes true at time point 12.

**Unrealizable requirement subset**

12. Click the checkbox next to `LPC_reach_hover_12` to deselect it.
    * Click the checkbox next to `LPC_reach_hover_06` to select it, then click `Apply`.

13. From the `ACTIONS` menu, select `Check realizability`.
   * After some time FRET will indicate the selected requirements set is unrealizable by displaying a circled red X next to `vehicle`.

14. From the `ACTIONS` menu, select `Diagnose Unrealizable Requirements`
     * After some time, a chord diagram will appear.

15. Click on `Conflict 1`, whereupon a trace appears.

