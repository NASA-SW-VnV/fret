--- The Pursuit Of Realizable Requirements ---

This dataset includes the FRETish requirements and the Lustre contracts (JKIND input) for the case studies presented in the paper.

All FRETish requirements can be imported and inspected in FRET.
All Lustre contracts can be checked for realizability using the original JSYN/JSYN-VG algorithms.

Structure:
	- Project Name : the name of the case study / example
		- Requirements : folder with FRETish requirements (.json files). The QFCS project has not been ported to FRET.
		- Realizability : folder with Lustre contracts that are given as input to JSYN/JSYN-VG in JKIND, for the realizability check.
			- <name>.lus : Lustre contract.
			- <name>_connected_components : Lustre contracts for the connected components that were computed in this project.
			- <name>_inlined* : Variations of Lustre contracts for the QFCS components, where templates have been inlined. Read Section 7.1 in paper for details.
			- QFCS/OSAS/OSAS_connected_components/Fixed : Lustre contracts after fixing conflicts and mistakes in the original OSAS specification. Read Section 7.2 in paper for details.
			
			