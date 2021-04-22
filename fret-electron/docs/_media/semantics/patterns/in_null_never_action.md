## [in,null,never,action] Pattern
![[in,null,never,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_never_action.svg "[in,null,never,action] Pattern")
 * **FT Semantics**: G (`$scope_mode$` -> (!`$action$`))
 * **PT Semantics**: H (`$scope_mode$` -> (!`$action$`))
 * **Description**: Never, the component "`$component_name$`" shall perform `$action$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall never reset System_   
   >  * **FT Semantics**: G (`PackageInstallation` -> (!`reset` `System`))
   >  * **PT Semantics**: H (`PackageInstallation` -> (!`reset` `System`))
   >  * **Description**: Never, the component "**_system_**" shall perform **_reset System_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)