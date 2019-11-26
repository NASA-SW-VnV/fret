## [in,null,always,action] Pattern
![[in,null,always,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_always_action.svg "[in,null,always,action] Pattern")
 * **FT Semantics**: G (`$scope_mode$` -> `$action$`)
 * **PT Semantics**: H (`$scope_mode$` -> `$action$`)
 * **Description**: Always, the component "`$component_name$`" shall perform `$action$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall always reset System_   
   >  * **FT Semantics**: G (`PackageInstallation` -> `reset` `System`)
   >  * **PT Semantics**: H (`PackageInstallation` -> `reset` `System`)
   >  * **Description**: Always, the component "**_system_**" shall perform **_reset System_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)