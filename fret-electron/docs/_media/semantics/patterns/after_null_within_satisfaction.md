## [after,null,within,satisfaction] Pattern
![[after,null,within,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_within_satisfaction.svg "[after,null,within,satisfaction] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (`$post_condition$` | (F[`$duration$`] `$post_condition$`))))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: Within `$duration$` time units, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall within 10 secs satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (( `indicationLight` = `orange` ) | (F[10 `secs`] ( `indicationLight` = `orange` )))))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: Within **_10 secs_** time units, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)