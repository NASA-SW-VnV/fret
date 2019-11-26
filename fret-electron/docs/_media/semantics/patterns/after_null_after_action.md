## [after,null,after,action] Pattern
![[after,null,after,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_after_action.svg "[after,null,after,action] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (((!`$action$`) & (!(F[`$duration$`] (!(!`$action$`))))) & (`$action$` | (F[`$duration$`+1] `$action$`)))))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: TIME, the component "`$component_name$`" shall perform `$action$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall after 10 secs reset System_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (((!`reset` `System`) & (!(F[10 `secs`] (!(!`reset` `System`))))) & (`reset` `System` | (F[10 `secs`+1] `reset` `System`)))))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: TIME, the component "**_system_**" shall perform **_reset System_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
