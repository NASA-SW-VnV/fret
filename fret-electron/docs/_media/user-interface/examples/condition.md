#### Condition (optional)

Specifies the conditions under which the requirement shall be true. The condition can be a sequence of Boolean expressions connected by the keyword and and or. Individual Boolean Expressions can be qualified by keywords

* **unless**
* **when**, **where**, **if**, **upon**

Validity of each Boolean Expression _BEXP_ can be optionally stated by writing
"_BEXP_ is **true**" (same as _BEXP_) or "_BEXP_ is **false**" (same as !
_BEXP_).

A Boolean Expression can be a Boolean variable, a proposition (e.g., "light_on"), a predicate
(e.g., "on(lamp2)"), a numerical comparison
between two numerical expressions (e.g., "level(tank1) > 0.8 * content"), 
or a concatenation of Boolean Expressions using the operators

* **!** (not)
* **&** (and)
* **|** (or)
* **=>** or **->** (implies)
* **<=>** or **<->** (equivalence, biconditional)
* **xor** (exclusive OR)

Boolean or numerical variables correspond to signals or variables in the
component.

The mapping between requirement variables and model signals is specified
when exporting requirements for verification. Check the user manual under
"Exporting for Analysis" for more details.

Parentheses **(** **)** are used as usual. Please use parentheses as much as
possible to avoid mistakes and misunderstandings.

Examples:

* **if** ((level(tank1) < 0.3) & (altitude > 1000)) **is false**
* **If** (limits & !standby & !apfail & supported)
