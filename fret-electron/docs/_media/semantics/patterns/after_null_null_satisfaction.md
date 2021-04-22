## [after,null,null,satisfaction] Pattern
![[after,null,null,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/after_null_null_satisfaction.svg "[after,null,null,satisfaction] Pattern")
 * **FT Semantics**: ((!`last_in_$scope_mode$`) U (`last_in_$scope_mode$` & (X (F `$post_condition$`)))) | (G (!`last_in_$scope_mode$`))
 * **PT Semantics**: Under construction.
 * **Description**: At some future point, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced strictly after_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _after PackageInstallation,  the system shall   satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: ((!`last_in_PackageInstallation`) U (`last_in_PackageInstallation` & (X (F ( `indicationLight` = `orange` ))))) | (G (!`last_in_PackageInstallation`))
   >  * **Description**: At some future point, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced strictly after_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)