## [in,null,immediately,action] Pattern
![[in,null,immediately,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_immediately_action.svg "[in,null,immediately,action] Pattern")
 * **FT Semantics**: G (`first_in_$scope_mode$` -> `$action$`)
 * **PT Semantics**: H (`first_in_$scope_mode$` -> `$action$`)
 * **Description**: Immediately, the component "`$component_name$`" shall perform `$action$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall immediately reset System_   
   >  * **FT Semantics**: G (`first_in_PackageInstallation` -> `reset` `System`)
   >  * **PT Semantics**: H (`first_in_PackageInstallation` -> `reset` `System`)
   >  * **Description**: Immediately, the component "**_system_**" shall perform **_reset System_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)