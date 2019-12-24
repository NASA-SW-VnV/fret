#### Timing (optional)

specifies the time points or time intervals, where a response has to occur once scope and condition(s) are satisfied. Supported options are

* **within** DURATION
* **for** DURATION
* **after** DURATION
* **immediately**
* **eventually**
* **always**
* **never**

DURATION is a non-negative integer number followed by a time-unit,
for example 12 seconds or 5.5 minutes. Time units can be one of the following:
* **tick** or **ticks**
* **microsecond** or **microseconds**
* **second** or **seconds**
* **sec** or **sec**
* **minute** or **minutes**
* **hour** or **hours**

Note that the time units are not checked or converted by FRET. FRET exports verification code to analysis tools, which are in charge of interpreting the time
units. Check the user manual under "Exporting for Analysis" for more details.

Examples:
* **when in** landing FSM **shall within** 2 **seconds satisfy** is_stable
* **after** 4 **minutes**
* **never**
