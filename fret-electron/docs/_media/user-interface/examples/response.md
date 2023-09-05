### Response (mandatory)

Specifies the response that the component must provide to fulfill the requirement.
The current version of FRET supports the form:

**satisfy** BEXP (Boolean Expression, see the help for the Conditions field).

### Restrictions

The following uppercase identifiers cannot be used as variables in boolean
and arithmetic expressions:

`A E F G H O S T U V X Y Z AF AG AX BU EF EG EX SI UI ABF ABG EBF EBG MAX MIN LAST`.  

#### Examples
* **satisfy** (alt – alt0) <= 35
* **satisfy** ((TurnKnob <= -3.0 | TurnKnob >= 3.0) -> TurnKnob =
rollRefCmd)
* **satisfy** !onFire
