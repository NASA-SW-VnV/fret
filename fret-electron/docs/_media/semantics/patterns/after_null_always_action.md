## [after,null,always,action] Pattern
![[after,null,always,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_always_action.svg "[after,null,always,action] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (G `$action$`)))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: Always, the component "`$component_name$`" shall perform `$action$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall always reset System_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (G `reset` `System`)))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: Always, the component "**_system_**" shall perform **_reset System_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)