### Condition (optional)

specifies the condition after which the response shall hold,
taking into account scope and timing. A condition can be either:

* a _regular_ condition, meaning the requirement holds **_upon_** a condition becoming true; i.e., at the point
where the condition becomes true after being false, or the
condition is true at the beginning of a scope interval;

* a _holding_ condition, meaning the response holds **_whenever_** the condition holds.

A holding condition is introduced by the keyword **whenever**.
A regular condition is introduced by the keyword **upon** (or **when**,
**where**, **if**).
The condition can be a sequence of Boolean expressions, optionally connected
by the keywords *and* and *or*.

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

#### EXAMPLES

* **Upon** powered_on the component shall immediately satisfy bootup
* **Whenever** intruder the alarm shall immediately satisfy sound

The contrast between regular and holding conditions is shown in the following two
examples, in the case where at some point p holds forever:

* Upon p the software shall eventually satisfy q
* Whenever p the software shall eventually satisfy q

In the first, q must be satisfied at least once.
In the second, q must be satisfied infinitely often.

#### RESTRICTIONS

The list of reserved words that cannot be used as variables in
Boolean and arithmetic expressions appears in the user manual in the section
"Writing requirements". In particular, the following are not allowed:
A, E, F, G, H, O, S, T, U, V, X, Y, Z, init.
