#### Scope (optional)

specifies intervals where the requirement must hold; intervals are defined with respect to a MODE, e.g.,

* **before** MODE, **only before** MODE
* **in** MODE, **not in** MODE, **when in** MODE, **during** MODE
*  **after** MODE

These specifications can be negated (e.g., **when not in** MODE), and refined by constraints (strictly or only) and behavior on entering or leaving the mode.
MODE is a string identifier starting with an upper- or lower-case letter, followed by letters, digits or underscores ‘_’.

Examples:

* **after** initialization
* **when in** landing_mode_1
