## [before,null,always,satisfaction] Pattern
![[before,null,always,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/before_null_always_satisfaction.svg "[before,null,always,satisfaction] Pattern")
 * **FT Semantics**: (F `first_in_$scope_mode$`) -> (!((!`first_in_$scope_mode$`) U ((!`$post_condition$`) & (!`first_in_$scope_mode$`))))
 * **PT Semantics**: Under construction.
 * **Description**: Always, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced strictly before_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _before PackageInstallation,  the system shall always satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: (F `first_in_PackageInstallation`) -> (!((!`first_in_PackageInstallation`) U ((!( `indicationLight` = `orange` )) & (!`first_in_PackageInstallation`))))
   >  * **Description**: Always, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced strictly before_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)