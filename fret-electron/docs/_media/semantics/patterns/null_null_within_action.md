## [null,null,within,action] Pattern
![[null,null,within,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/null_null_within_action.svg "[null,null,within,action] Pattern")
 * **FT Semantics**: `$action$` | (F[`$duration$`] `$action$`)
 * **PT Semantics**: H (((!`$action$`) S ((!`$action$`) & FTP)) -> (FTP | (O[`$duration$`] FTP)))
 * **Description**: Within `$duration$` time units, the component "`$component_name$`" shall perform `$action$`.
   > **_Example_**: _  the system shall within 10 secs reset System_   
   >  * **FT Semantics**: `reset` `System` | (F[10 `secs`] `reset` `System`)
   >  * **PT Semantics**: H (((!`reset` `System`) S ((!`reset` `System`) & `FTP`)) -> (`FTP` | (O[10 `secs`] `FTP`)))
   >  * **Description**: Within **_10 secs_** time units, the component "**_system_**" shall perform **_reset System_**.
***
[[Home]](../semantics.md)