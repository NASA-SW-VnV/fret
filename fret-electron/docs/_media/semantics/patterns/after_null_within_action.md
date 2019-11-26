## [after,null,within,action] Pattern
![[after,null,within,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_within_action.svg "[after,null,within,action] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (`$action$` | (F[`$duration$`] `$action$`))))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: Within `$duration$` time units, the component "`$component_name$`" shall perform `$action$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall within 10 secs reset System_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (`reset` `System` | (F[10 `secs`] `reset` `System`))))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: Within **_10 secs_** time units, the component "**_system_**" shall perform **_reset System_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)