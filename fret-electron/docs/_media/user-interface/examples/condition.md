#### Condition (optional)

Specifies the conditions under which the requirement shall be true. The condition can be a sequence of Boolean expressions connected by the keyword and and or. Individual Boolean Expressions can be qualified by keywords

* **unless**
* **when**, **where**, **if**, **upon**

Validity of each Boolean Expression BEXP can be stated by BEXP is **true** (same as BEXP) or BEXP is **false**.
A Boolean Expression can be a Boolean variable, a numerical comparison between two numerical expressions (e.g., level > 0.8 * content), or a concatenation of Boolean Expressions using the operators

* **!** (not)
* **&** (and)
* **|** (or)
* **=>** or **->** (implies)
* **<=>** or **<->** (biconditional)
* **xor** (exclusive OR)

Boolean or numerical variables correspond to signals or variables in the
component.
The mapping between requirement variables and model signals is specified when exporting requirements for verification. Check the user manual under "Exporting for Analysis" for more details.

Parentheses **(** **)** are used as usual. Please use parentheses as much as
possible to avoid mistakes and misunderstandings.

Examples:

* **if** **((**level < 0.3**)** **&** **(**altitude > 1000**))** **is not true**
* **If** **(**limits **&** **!**standby **&** **!**apfail **&** supported**)**
