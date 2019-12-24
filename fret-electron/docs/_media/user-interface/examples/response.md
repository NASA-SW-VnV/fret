#### Response (mandatory)

Specifies the response that the component must provide to fulfill the requirement.
The current version of FRET supports the form:
**satisfy** BEXPR (Boolean Expression). The keyword **satisfy** is
optional.

Future versions will fully support
* **increment the** ID **counter**
* **decrement the** ID **counter**
* **send** message
* **start** ID
* **stop** ID
* **enable** ID
* **disable** ID
* **set the** ID **to** NUMBER
* **reset the** ID **to** NUMBER
* **set the** ID **flag to** BEXPR
* **reset the** ID **flag to** BEXPR
* **enter** ID **mode**

ID is a string identifier starting with an upper- or lower-case letter, followed by letters, digits or underscores ‘_’.

Examples:

* **satisfy (**alt – alt0**)** <= 35
* **satisfy ((**TurnKnob <= -3.0 **|** TurnKnob >= 3.0**) ->** TurnKnob = rollRefCmd**)**
