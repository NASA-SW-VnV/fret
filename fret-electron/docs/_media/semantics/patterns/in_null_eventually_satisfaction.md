## [in,null,eventually,satisfaction] Pattern
![[in,null,eventually,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_eventually_satisfaction.svg "[in,null,eventually,satisfaction] Pattern")
 * **FT Semantics**: G (`first_in_$scope_mode$` -> (`$scope_mode$` U (`$scope_mode$` & `$post_condition$`)))
 * **PT Semantics**: H (`last_in_$scope_mode$` -> (`$scope_mode$` S (`$scope_mode$` & `$post_condition$`)))
 * **Description**: At some future point, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall eventually satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (`first_in_PackageInstallation` -> (`PackageInstallation` U (`PackageInstallation` & ( `indicationLight` = `orange` ))))
   >  * **PT Semantics**: H (`last_in_PackageInstallation` -> (`PackageInstallation` S (`PackageInstallation` & ( `indicationLight` = `orange` ))))
   >  * **Description**: At some future point, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)