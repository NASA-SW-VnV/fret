# Writing Requirements in FRET

***

<img src="../../screen_shots/WriteRequirement.png">

***

A FRET requirement is an English (to be precise "FRETish") sentence containing up to six fields: *scope*, *condition*, *component*, *shall*, *timing* and *response*. Three fields are mandatory: component, shall, response. There is a [grammar](../../../_media/rrd/index.html ':include width=100% height=800px') for the allowable sentences. The grammar, displayed as "railroad diagrams", is accessible from this view by clicking on the question mark. Mind you, this is not for the faint-hearted.

Here is an example requirement:
<span style="color:gray">**"In flight mode the battery shall always satisfy voltage > 9"** </span>

While typing the body of a requirement, FRET parses the requirement and recognizes and color codes the parts associated with each field. The lower part of the window dynamically displays (in red) parser feedback while typing. Help is provided for the user by clicking on the corresponding colored field bubbles on top of the editor.

## Mandatory fields

1. Component. Specifies the *component* that the requirement refers to. [Component Help Menu](./component.md)

2. Shall. The word *shall* expresses that the component's behavior must conform to the requirement. This is typical in requirements documents.

3. Response. Specifies the *response*, which is the required component behavior. It must be a boolean condition that the component's behavior must satisfy. [Response Help Menu](./response.md)

## Optional fields

1. Scope. The optional *scope* field specifies the period where the requirement holds. If omitted, the requirement is deemed to hold universally, subject to condition, below. The scope is specified relative to system *modes*. The scope can specify system behavior *before* a specified mode occurs, or *after* a specified mode ends, or when the system is *in* a specified mode. The mode is specified by giving its mode name. [Scope Help Menu](./scope.md)

2. Condition. The optional *condition* field is a boolean expression that further constrains when the requirement response is to occur.  The boolean expression is in terms of variables. [Condition Help Menu](./condition.md)

3. Timing. The optional *timing* field specifies when the response shall happen, relative to the scope and condition.  Timing can be *immediately*, *eventually*, *always*, *never*, *within N time units*,  *for N time units*, or *after N time units*. The latter means that the response happens _N_ time units from the beginning of the requirement's period, and does not happen before that; i.e., does not happen for *N-1* time units after the beginning of the period. [Timing Help Menu](./timing.md)

**Note: Variable dictionary**

Clicking on the dictionary icon will bring up a table showing variable dictionary per component in the Assistant pane. All components of the selected project will be listed under the table.  The components can be expanded to show existing variables. ![Variable Dictionary](./../screen_shots/VariableDictionary.png)

When the variable dictionary is opened, you can click on an existing variable to input the variable in the requirement. This will insert the varialbe at the cursor or replace a selected string with the variable.

**Note: Boolean expressions**

The Boolean operators allowed in the Boolean expression condition and response fields are: ! (negation), & (conjunction), | (disjunction), xor (exclusive or),  -> (implication), <-> (equivalence). An alternative for implication is 'if p then q'. The numeric comparison operators are =, !=, <, >, <=, >=. The numeric operators are +, -, *, /, mod, and ^ (exponentiation). Numerical terms and predicates are in standard form; e.g., f(x,y),  p(x,y,z).

**Note: Limitations of the current simulator**

* The simulator will not work if the response or condition Boolean formulas contain any comparisons or terms ; e.g., not allowed: "y < x"; "p(x,y)". In other words, the Boolean formulas must be over atomic propositions; e.g., p -> q & ! r.

* The simulator will not work if any of the following uppercase atomic propositions are in the boolean formulas:  
A E F G H O S T U V X Y Z  
AF AG AX BU EF EG EX   
ABF ABG EBF EBG MAX MIN  
LAST



[Back to FRET home page](../../../userManual.md)
