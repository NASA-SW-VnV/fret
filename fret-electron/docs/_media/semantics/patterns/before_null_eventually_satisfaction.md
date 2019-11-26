## [before,null,eventually,satisfaction] Pattern
![[before,null,eventually,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/before_null_eventually_satisfaction.svg "[before,null,eventually,satisfaction] Pattern")
 * **FT Semantics**: !((!`$post_condition$`) U `first_in_$scope_mode$`)
 * **PT Semantics**: Under construction.
 * **Description**: At some future point, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced strictly before_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _before PackageInstallation,  the system shall eventually satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: !((!( `indicationLight` = `orange` )) U `first_in_PackageInstallation`)
   >  * **Description**: At some future point, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced strictly before_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
