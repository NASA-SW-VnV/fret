## [after,null,null,action] Pattern
![[after,null,null,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_null_action.svg "[after,null,null,action] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (F `$action$`)))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: At some future point, the component "`$component_name$`" shall perform `$action$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall   reset System_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (F `reset` `System`)))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: At some future point, the component "**_system_**" shall perform **_reset System_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)