#### Condition (optional)

specifies the trigger condition after which the requirement shall hold,
taking into account scope. Trigger means the requirement holds **upon** a
condition becoming true; i.e., at the point
where the condition becomes true after being false, or the
condition is true at the beginning of a scope interval.

The condition can be a sequence of Boolean expressions, optionally connected
by the keywords *and* and *or*. Individual Boolean Expressions can be
qualified by keywords

* **unless**
* **upon**, **when**, **where**, **if** (these have identical meaning in FRETish)

Validity of each Boolean Expression _BEXP_ can be optionally stated by writing
"_BEXP_ is **true**" (same as _BEXP_) or "_BEXP_ is **false**" (same as !
_BEXP_).

A Boolean Expression can be a Boolean variable (see variable name
restrictions below), a proposition (e.g., "light_on"), an atomic formula (e.g.,
"brightness(lamp2, 0.7)"), a numerical comparison between two numerical
expressions (e.g., "level(tank1) > 0.8 * content"), or a formula constructed
using the operators

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

> __Important Note:__ [Restrictions](../restrictions.md)

Examples:

* **upon** powered_on
* **if** (limits & !standby & !apfail & supported)
* **when** ((level(tank1) < 0.3) & (altitude > 1000)) **is false**


