## [in,null,null,action] Pattern
![[in,null,null,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_null_action.svg "[in,null,null,action] Pattern")
 * **FT Semantics**: G (`first_in_$scope_mode$` -> (`$scope_mode$` U (`$scope_mode$` & `$action$`)))
 * **PT Semantics**: H (`last_in_$scope_mode$` -> (`$scope_mode$` S (`$scope_mode$` & `$action$`)))
 * **Description**: At some future point, the component "`$component_name$`" shall perform `$action$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall   reset System_   
   >  * **FT Semantics**: G (`first_in_PackageInstallation` -> (`PackageInstallation` U (`PackageInstallation` & `reset` `System`)))
   >  * **PT Semantics**: H (`last_in_PackageInstallation` -> (`PackageInstallation` S (`PackageInstallation` & `reset` `System`)))
   >  * **Description**: At some future point, the component "**_system_**" shall perform **_reset System_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)