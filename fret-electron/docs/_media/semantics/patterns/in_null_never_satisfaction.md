## [in,null,never,satisfaction] Pattern
![[in,null,never,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_never_satisfaction.svg "[in,null,never,satisfaction] Pattern")
 * **FT Semantics**: G (`$scope_mode$` -> (!`$post_condition$`))
 * **PT Semantics**: H (`$scope_mode$` -> (!`$post_condition$`))
 * **Description**: Never, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall never satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (`PackageInstallation` -> (!( `indicationLight` = `orange` )))
   >  * **PT Semantics**: H (`PackageInstallation` -> (!( `indicationLight` = `orange` )))
   >  * **Description**: Never, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)