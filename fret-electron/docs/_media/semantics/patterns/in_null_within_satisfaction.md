## [in,null,within,satisfaction] Pattern
![[in,null,within,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/in_null_within_satisfaction.svg "[in,null,within,satisfaction] Pattern")
 * **FT Semantics**: G (`first_in_$scope_mode$` -> ((P | (`last_in_$scope_mode$` | (X P))) | (F[`$duration$`-1] (P | (`last_in_$scope_mode$` | (X P))))))
 * **PT Semantics**: H ((((!`$post_condition$`) & `$scope_mode$`) S (((!`$post_condition$`) & `$scope_mode$`) & `first_in_$scope_mode$`)) -> (`first_in_$scope_mode$` | (O[`$duration$`-1] `first_in_$scope_mode$`)))
 * **Description**: Within `$duration$` time units, the component "`$component_name$`" shall satisfy `$post_condition$`. This is only enforced when "`$component_name$`" is in mode `$scope_mode$`.
   > **_Example_**: _in PackageInstallation,  the system shall within 10 secs satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (`first_in_PackageInstallation` -> ((P | (`last_in_PackageInstallation` | (X P))) | (F[10 `secs`-1] (P | (`last_in_PackageInstallation` | (X P))))))
   >  * **PT Semantics**: H ((((!( `indicationLight` = `orange` )) & `PackageInstallation`) S (((!( `indicationLight` = `orange` )) & `PackageInstallation`) & `first_in_PackageInstallation`)) -> (`first_in_PackageInstallation` | (O[10 `secs`-1] `first_in_PackageInstallation`)))
   >  * **Description**: Within **_10 secs_** time units, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**. This is only enforced when "**_system_**" is in mode **_PackageInstallation_**.
***
[[Home]](../semantics.md)