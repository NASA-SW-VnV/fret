## [before,null,never,action] Pattern
![[before,null,never,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/before_null_never_action.svg "[before,null,never,action] Pattern")
 * **FT Semantics**: (F `first_in_$scope_mode$`) -> (!((!`first_in_$scope_mode$`) U ((!(!`$action$`)) & (!`first_in_$scope_mode$`))))
 * **PT Semantics**: Under construction.
 * **Description**: Never, the component "`$component_name$`" shall perform `$action$`. This is only enforced strictly before_WORD the first occurence of `$scope_mode$` (if `$scope_mode$` ever occurs).
   > **_Example_**: _before PackageInstallation,  the system shall never reset System_   
   >  * **FT Semantics**: (F `first_in_PackageInstallation`) -> (!((!`first_in_PackageInstallation`) U ((!(!`reset` `System`)) & (!`first_in_PackageInstallation`))))
   >  * **Description**: Never, the component "**_system_**" shall perform **_reset System_**. This is only enforced strictly before_WORD the first occurence of **_PackageInstallation_** (if **_PackageInstallation_** ever occurs).
***
[[Home]](../semantics.md)