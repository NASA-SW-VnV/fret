# Writing Requirements in FRET

***

<img src="../screen_shots/WriteRequirement.png">

***

A FRET requirement is a "FRETish" sentence, which is an English sentence containing standard boolean expressions. The FRET requirement can contain up to seven fields: *scope*, *condition*, *component*, *shall*, *probability*, *timing* and *response*. Three fields are mandatory: component, shall, response. There is a [grammar](../fretishGrammar/index.html ':include width=100% height=800px') for the allowable sentences. The grammar, displayed as "railroad diagrams", is accessible from this view by clicking on the question mark. Mind you, this is not for the faint-hearted.

Here is an example requirement:
<span style="color:gray">**"In flight mode the battery shall always satisfy voltage > 9"** </span>

While typing the body of a requirement, FRET parses the requirement and recognizes and color codes the parts associated with each field. The lower part of the window dynamically displays (in red) parser feedback while typing. Help is provided for the user by clicking on the corresponding colored field bubbles on top of the editor.

FRET supports two modes for writing requirements: (1) Classic FRET and (2) Probabilistic FRET. You can switch between them using the toggle button (*Activate probabilistic FRETish*). Probabilistic FRET contains the *probability* field.

Here is an example requirement:
<span style="color:gray">**"In auto-taxi mode SensorSelection shall with probability > 0.95 always satisfy accurate"** </span>

***

<img src="../screen_shots/WriteProbabilisticRequirement.png">

***

## Mandatory fields

The following fields are mandatory in both Classic and Probabilistic FRET.

1. Component. Specifies the *component* that the requirement refers to. For more details, see the [Component Help Menu](./examples/component.md)

2. Shall. The word *shall* expresses that the component's behavior must conform to the requirement. This is typical in requirements documents.

3. Response. Specifies the *response*, which is the required component behavior. It must be a boolean condition that the component's behavior must satisfy. For more details, see the [Response Help Menu](./examples/response.md)

## Optional fields

Classic FRET contains the following three optional fields:

1. Scope. The optional *scope* field specifies the period where the requirement holds. If omitted, the requirement is deemed to hold universally, subject to condition, below. The scope is specified relative to system *modes*. The scope can specify system behavior *before* a specified mode occurs, or *after* a specified mode ends, or when the system is *in* a specified mode. In the latter case, there may be many intervals in which the requirement holds. The mode is specified by giving its mode name. For more details, see the [Scope Help Menu](./examples/scope.md)

2. Condition. The optional *condition* field is a boolean expression that further constrains when the requirement response is to occur. For more details, see the [Condition Help Menu](./examples/condition.md)

3. Timing. The optional *timing* field specifies when the response shall happen, relative to the scope and condition.  Timing can be *immediately* (synonyms: *initially*, *at the first timepoint*, *at the same timepoint*), *at the next timepoint*, *finally* (synonym: *at the last timepoint*), *eventually*, *always*, *never*, *within N time units*,  *for N time units*, *after N time units*, *until* stop_condition, or *before* stop_condition. The timing *after* means that the response happens _N_ time units from the beginning of the requirement's period, and does not happen before that; i.e., does not happen for *N-1* time units after the beginning of the period. For more details, see the [Timing Help Menu](./examples/timing.md)

> __Note:__ The Boolean operators allowed in the boolean expression *while* scope, condition, *until* and *before* timings, and response fields are: `!` (negation), `&` (conjunction), `|` (disjunction), `xor` (exclusive or),  `->` or `=>` (implication), `<->` or `<=>` (equivalence). An alternative phrasing for implication is `if p then q`. There are nine predefined temporal predicates: , `preBool`, `preInt`, `preReal`, `persisted`, `occurred`, `persists`, `occurs`, `prevOcc` and `nextOcc`. See [Temporal Condition Help](./examples/temporal_condition_explanations.md).
The arithmetic comparison operators are `=, !=, <, >, <=, >=`. The arithmetic operators are `+, -, *, /, mod`, and `^` (exponentiation). Arithmetic terms and predicates are in standard form; e.g., `f(x,y)`,  `p(x,y,z)`.

> __Reserved Words:__ The following cannot be used as variables in Boolean and arithmetic expressions:  
`A, ABF, ABG, AF, AG, ASSIGN, AX, BU, COMPASSION, COMPUTE, COMPWFF,
CONSTANTS, CONSTRAINT, CTLSPEC, CTLWFF, DEFINE, E, EBF, EBG, EF, EG, EX, F,
FAIRNESS, FROZENVAR, G, H, IN, INIT, INVAR, INVARSPEC, ISA, IVAR, JUSTICE,
LTLSPEC, LTLWFF, MAX, MDEFINE, MIN, MIRROR, MODULE, NAME, O, PRED,
PREDICATES, PSLSPEC, PSLWFF, S, SIMPWFF, SPEC, T, TRANS, U, V, VAR, X, Y, Z`  
`abs, array, bool, boolean, case, count, esac, extend, in, init, integer,
max, min, mod, next, of, process, real, resize, self, signed, sizeof,
swconst, union, unsigned, uwconst, word, word1, xnor, xor`.

## Optional Probabilistic FRET fields

Probabilistic FRET contains the aforementioned *scope*, *condition*, and *timing* fields, along with an optional fourth field: *probability*.

1. Probability. The optional *probability* field specifies the probability assigned to the timed response (i.e., the combination of the timing and response fields). The probability field can be left empty, i.e., the requirement is not probabilistic, or can be instantiated with the following phrase *with probability RELATIONAL_OP prob_num*, where *RELATIONAL_OP* is a numeric comparison operator (e.g., `>=`, `<=`) and *prob_num* is a number between 0 and 1 (inclusive). For more details, see the [Probability Help Menu](./examples/probability.md)


### Templates tab

Predefined templates simplify requirement writing to just filling in necessary fields. You can access the *TEMPLATES* tab from the right pane on the *Create Requirement* or *Update Requirement* dialog.  A number of templates are already available in FRET: *Change State*, *Process Command*, *Check Bounds*, *Set Diagnostic Flag*, and *Prescribe Format*. More templates can be added on demand by the users as explained in [createTemplate](../creatingTemplates/createTemplate.md).

Upon selecting a predefined template, a FRETish requirement appears in the editor with fields that need to be filled in. For example, in the screenshot shown below, the *component*, *input_state*, *condition*, and *output_state* fields must be completed so that the requirement parses successfully.  An explanation of the chosen template and examples of how to instantiate the required fields are shown in the *TEMPLATES* pane.  Clicking on a field in the editor will allow the user to edit the field, and will also show options for filling in the field. Clicking on one of those options will copy the option to the field, whereupon the user can further edit the field.

***

<img src="../screen_shots/TemplateExampleAfterEditor.png">

***

### Variable glossary tab

FRET provides help to the user when writing requirements. For example, if a user wants to reuse a set of variables amongst the requirements of a specific project and has already entered some requirements, then FRET lists the variable names that were already used for these requirements in the *GLOSSARY* tab.

You can access the *GLOSSARY* tab from the right pane in the *Create Requirement* or *Update Requirement* dialog.  After selecting a project, you can select a component in the selected project using the *Component* menu bar. FRET then displays existing variables of the selected component. These variables can be filtered by the variable type including *Mode*, *Inputs*, *Outputs* and *Internal* using check boxes under the *Component* menu bar.  *Undefined* is used for variables with no existing assigned type. The variable types can  be assigned through the [FRET analysis portal](../ExportingForAnalysis/analysis.md).

***

<img src="../screen_shots/DictionaryVariables.png">

***

You can expand a variable on the *GLOSSARY* tab to see more details.  The details include a list of requirements referencing this variable and show values of variable attributes that are defined.  Current attributes of a variable include *variable type*, *data type*, *assignment*, *modelComponent*, and *description*.

***

<img src="../screen_shots/DictionaryExtendedVariable.png">

***

The list of variables shown in the *GLOSSARY* tab is used to autocomplete when typing in the editor of the  *Create Requirement* and *Update Requirement* dialog.

***

<img src="../screen_shots/autocomplete.png">

***




[Back to FRET home page](../userManual.md)
