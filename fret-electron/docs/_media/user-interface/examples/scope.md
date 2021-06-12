### Scope (optional)

specifies where the requirement must hold: in intervals defined with respect to a MODE, e.g.,

* **before** MODE, **only before** MODE
* **in** MODE, **not in** MODE,  **only in** MODE
* **after** MODE, **only after** MODE

or if not specified as above, then globally, i.e., throughout the entire execution.

MODE is a string identifier starting with an upper- or lower-case letter, followed by letters, digits or underscores ‘_’.

The **only** modes mean that when the system is not in the specified relationship to the mode
(i.e., the system is not **in**/**after**/**before** the mode) the response
must not occur.

#### Examples:

* _(global)_ The system shall always satisfy count >= 0
* **After** boot mode the system shall immediately satisfy prompt_for_password
* **Only after** arming mode shall the system eventually satisfy fired
* **In** landing mode the system shall eventually satisfy decrease_speed
* When **not in** initialization mode the system shall always satisfy commands_accepted
* **Only in** landing mode shall the system eventually satisfy landing_gear_down
* **Before** energized mode the system shall always satisfy energized_indicator_off
* **Only before** energized mode shall the system eventually satisfy
manually_touchable

It has been found to be useful to allow more general boolean expressions
in place of simple mode variables. The keyword **While** for boolean
expressions has a meaning like **In** for mode variables. Here are some
examples:

* **While** mode = 4 the watch shall always satisfy alarm_icon_on
* **Before** taxiing & receivedClearance the plane shall always satisfy !takeoff
* **After** landed & powerOff the doors shall within 3 seconds satisfy unlocked
