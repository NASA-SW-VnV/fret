## [in,regular,immediately,satisfaction] Pattern
_No image yet_
 * **FT Semantics**: G ((`$pre_condition$` & `$scope_mode$`) -> `$post_condition$`)
 * **PT Semantics**: H ((`$pre_condition$` & `$scope_mode$`) -> `$post_condition$`)
 * **Description**: We are working on formalizing this template. In the meanwhile, you can see its intended meaning in the diagram provided.
   > **_Example_**: _in PackageInstallation,  when lowLevel > highLevel,the system shall immediately satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (((`lowLevel` > `highLevel`) & `PackageInstallation`) -> ( `indicationLight` = `orange` ))
   >  * **PT Semantics**: H (((`lowLevel` > `highLevel`) & `PackageInstallation`) -> ( `indicationLight` = `orange` ))
***
[[Home]](../semantics.md)