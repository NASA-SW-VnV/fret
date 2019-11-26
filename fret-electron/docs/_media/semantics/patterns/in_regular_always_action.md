## [in,regular,always,action] Pattern
_No image yet_
 * **FT Semantics**: G ((`$pre_condition$` & `$scope_mode$`) -> `$action$`)
 * **PT Semantics**: H ((`$pre_condition$` & `$scope_mode$`) -> `$action$`)
 * **Description**: We are working on formalizing this template. In the meanwhile, you can see its intended meaning in the diagram provided.
   > **_Example_**: _in PackageInstallation,  when lowLevel > highLevel,the system shall always reset System_   
   >  * **FT Semantics**: G (((`lowLevel` > `highLevel`) & `PackageInstallation`) -> `reset` `System`)
   >  * **PT Semantics**: H (((`lowLevel` > `highLevel`) & `PackageInstallation`) -> `reset` `System`)
***
