#### Scope (optional)

specifies where the requirement must hold: either globally or in intervals
defined with respect to a MODE, e.g.,

* **before** MODE, **only before** MODE
* **in** MODE, **not in** MODE,  **only in** MODE
* **after** MODE, **only after** MODE

MODE is a string identifier starting with an upper- or lower-case letter, followed by letters, digits or underscores ‘_’.

The **only** modes mean that when the system is not in the specified relationship to the mode
(i.e., the system is not **in**/**after**/**before** the mode) the response must not occur.

Examples:

* **global** The system shall always satisfy count >= 0
* **After** boot mode the system shall immediately satisfy prompt_for_password
* **Only after** arming mode shall the system eventually satisfy fired
* **In** landing mode the system shall eventually satisfy decrease_speed
* When **not in** initialization mode the system shall always satisfy commands_accepted
* **Only in** landing mode shall the system eventually satisfy landing_gear_down
* **Before** energized mode the system shall always satisfy energized_indicator_off
* **Only before** energized mode shall the system eventually satisfy manually_touchable
