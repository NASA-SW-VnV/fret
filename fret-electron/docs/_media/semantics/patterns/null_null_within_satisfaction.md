## [null,null,within,satisfaction] Pattern
![[null,null,within,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/null_null_within_satisfaction.svg "[null,null,within,satisfaction] Pattern")
 * **FT Semantics**: `$post_condition$` | (F[`$duration$`] `$post_condition$`)
 * **PT Semantics**: H (((!`$post_condition$`) S ((!`$post_condition$`) & FTP)) -> (FTP | (O[`$duration$`] FTP)))
 * **Description**: Within `$duration$` time units, the component "`$component_name$`" shall satisfy `$post_condition$`.
   > **_Example_**: _  the system shall within 10 secs satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: ( `indicationLight` = `orange` ) | (F[10 `secs`] ( `indicationLight` = `orange` ))
   >  * **PT Semantics**: H (((!( `indicationLight` = `orange` )) S ((!( `indicationLight` = `orange` )) & `FTP`)) -> (`FTP` | (O[10 `secs`] `FTP`)))
   >  * **Description**: Within **_10 secs_** time units, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**.
***
[[Home]](../semantics.md)