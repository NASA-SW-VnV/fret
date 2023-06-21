### Timing (optional)

specifies the time points or time intervals, where a response has to occur once scope and condition(s) are satisfied. Supported options are

* **immediately**
* **at the next timepoint**
* **eventually**
* **always**
* **never**
* **within** DURATION
* **for** DURATION
* **after** DURATION
* **until** STOP_CONDITION
* **before** STOP_CONDITION

DURATION is a positive integer optionally followed by a time-unit,
for example 12 seconds or 5 minutes. Time units can be one of the following:
* **tick** or **ticks**
* **microsecond** or **microseconds**
* **millisecond** or **milliseconds**
* **second** or **seconds** or **sec** or **secs**
* **minute** or **minutes**
* **hour** or **hours**

Note that the time units are not checked, converted or reasoned about by FRET. FRET exports verification code to analysis tools, which are in charge of interpreting the time
units. Check the user manual under "Exporting for Analysis" for more details.

STOP_CONDITION is a Boolean expression. The timing **before** means that the
response must happen at least once before the STOP_CONDITION holds.

#### Restrictions
The following uppercase identifiers cannot be used as variables in boolean and arithmetic expressions:

`A E F G H O S T U V X Y Z AF AG AX BU EF EG EX SI UI ABF ABG EBF EBG MAX MIN LAST`.  

[//]: # (If you have some of those in your requirements, the database fret-db may not be able to be read. Also, the Simulator will not give correct results.)

#### Examples
* **immediately:** **In** roll_hold **mode RollAutopilot shall immediately satisfy if** (roll_angle
  < 6.0 & roll_angle > -6.0) **then** roll_hold_reference = 0.0
* **next:** **When** currentOverload **the** circuitBreaker **shall,
  at the next timepoint, satisfy** shutoff
* **eventually:** **In** landingMode **the** system **shall eventually satisfy**
  LandingGearLowered
* **always:** **The** autopilot **shall always satisfy if** allGood **then**
  state = nominal
* **never:** **In** drivingMode **the** system **shall never satisfy**
  cellPhoneOn & !cellPhoneHandsFree
* **for:** **When** errorCondition, **the** system **shall, for** 4 **seconds, satisfy** alarmOn
* **within:** **In** landing **mode, the** the system **shall within** 2 **seconds satisfy** is_stable
* **after:** **When** input = 1, **the** integrator **shall, after** 10
  **ticks, satisfy** output=10
* **until:** **In** CountdownMode **the** system **shall, until** Count = 0, **satisfy** Count > 0
* **before:** **The** system **shall, before** TakeOff, **satisfy** CheckListTasksCompleted
