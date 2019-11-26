## [null,null,after,action] Pattern
![[null,null,after,action] Pattern](../../../_media/user-interface/examples/svgDiagrams/null_null_after_action.svg "[null,null,after,action] Pattern")
 * **FT Semantics**: ((!`$action$`) & (!(F[`$duration$`] (!(!`$action$`))))) & (`$action$` | (F[`$duration$`+1] `$action$`))
 * **PT Semantics**: O (`$action$` & (((!FTP) & (!(O[`$duration$`] (!(!FTP))))) & (Y (((!`$action$`) S ((!`$action$`) & FTP)) & (((!`$action$`) & FTP) | (O[`$duration$`] ((!`$action$`) & FTP)))))))
 * **Description**: TIME, the component "`$component_name$`" shall perform `$action$`.
   > **_Example_**: _  the system shall after 10 secs reset System_   
   >  * **FT Semantics**: ((!`reset` `System`) & (!(F[10 `secs`] (!(!`reset` `System`))))) & (`reset` `System` | (F[10 `secs`+1] `reset` `System`))
   >  * **PT Semantics**: O (`reset` `System` & (((!`FTP`) & (!(O[10 `secs`] (!(!`FTP`))))) & (Y (((!`reset` `System`) S ((!`reset` `System`) & `FTP`)) & (((!`reset` `System`) & `FTP`) | (O[10 `secs`] ((!`reset` `System`) & `FTP`)))))))
   >  * **Description**: TIME, the component "**_system_**" shall perform **_reset System_**.
***
