## [in,null,immediately,satisfaction] Pattern
![[in,null,immediately,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_immediately_satisfaction.svg "[in,null,immediately,satisfaction] Pattern")
 * **FT Semantics**: G (`first_in_$scope_mode$` -> `$post_condition$`)
 * **PT Semantics**: H (`first_in_$scope_mode$` -> `$post_condition$`)
 * **Description**: Immediately, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall immediately satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (`first_in_PackageInstallation` -> ( `indicationLight` = `orange` ))
   >  * **PT Semantics**: H (`first_in_PackageInstallation` -> ( `indicationLight` = `orange` ))
   >  * **Description**: Immediately, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)