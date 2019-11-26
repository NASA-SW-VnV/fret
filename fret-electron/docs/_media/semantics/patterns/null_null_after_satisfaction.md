## [null,null,after,satisfaction] Pattern
![[null,null,after,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/null_null_after_satisfaction.svg "[null,null,after,satisfaction] Pattern")
 * **FT Semantics**: ((!`$post_condition$`) & (!(F[`$duration$`] (!(!`$post_condition$`))))) & (`$post_condition$` | (F[`$duration$`+1] `$post_condition$`))
 * **PT Semantics**: O (`$post_condition$` & (((!FTP) & (!(O[`$duration$`] (!(!FTP))))) & (Y (((!`$post_condition$`) S ((!`$post_condition$`) & FTP)) & (((!`$post_condition$`) & FTP) | (O[`$duration$`] ((!`$post_condition$`) & FTP)))))))
 * **Description**: TIME, the component "`$component_name$`" shall satisfy `$post_condition$`.
   > **_Example_**: _  the system shall after 10 secs satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: ((!( `indicationLight` = `orange` )) & (!(F[10 `secs`] (!(!( `indicationLight` = `orange` )))))) & (( `indicationLight` = `orange` ) | (F[10 `secs`+1] ( `indicationLight` = `orange` )))
   >  * **PT Semantics**: O (( `indicationLight` = `orange` ) & (((!`FTP`) & (!(O[10 `secs`] (!(!`FTP`))))) & (Y (((!( `indicationLight` = `orange` )) S ((!( `indicationLight` = `orange` )) & `FTP`)) & (((!( `indicationLight` = `orange` )) & `FTP`) | (O[10 `secs`] ((!( `indicationLight` = `orange` )) & `FTP`)))))))
   >  * **Description**: TIME, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**.
***
[[Home]](../semantics.md)