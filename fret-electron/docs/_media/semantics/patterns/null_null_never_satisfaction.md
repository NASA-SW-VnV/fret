## [null,null,never,satisfaction] Pattern
![[null,null,never,satisfaction] Pattern](../../../_media/user-interface/examples/svgDiagrams/null_null_never_satisfaction.svg "[null,null,never,satisfaction] Pattern")
 * **FT Semantics**: G (!`$post_condition$`)
 * **PT Semantics**: H (!`$post_condition$`)
 * **Description**: Never, the component "`$component_name$`" shall satisfy `$post_condition$`.
   > **_Example_**: _  the system shall never satisfy (indicationLight = orange)_   
   >  * **FT Semantics**: G (!( `indicationLight` = `orange` ))
   >  * **PT Semantics**: H (!( `indicationLight` = `orange` ))
   >  * **Description**: Never, the component "**_system_**" shall satisfy **_( indicationLight = orange )_**.
***
[[Home]](../semantics.md)