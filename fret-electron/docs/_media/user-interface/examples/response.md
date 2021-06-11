#### Response (mandatory)

Specifies the response that the component must provide to fulfill the requirement.
The current version of FRET supports the form:
**satisfy** BEXP (Boolean Expression, see the help for the Conditions field). 

Examples:

* **satisfy** (alt – alt0) <= 35
* **satisfy** ((TurnKnob <= -3.0 | TurnKnob >= 3.0) -> TurnKnob =
rollRefCmd)
* **satisfy** !onFire
