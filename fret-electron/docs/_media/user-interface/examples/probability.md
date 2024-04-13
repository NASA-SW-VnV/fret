### Probability (optional)

Specifies the probability assigned to the timed response. The probability field can be left empty; i.e., the requirement is not probabilistic, or can be instantiated with the following phrase "**with probability** _RELATIONAL_OP_ _prob_num_", where:

* _RELATIONAL_OP_ is a numeric comparison operator;
* _prob_num_ is a number between 0 and 1 inclusive.


#### EXAMPLES

* The software shall **with probability > 0.9999** for 1000 seconds satisfy !error
* Whenever error, the rover shall **with probability > 0.98** always satisfy ! collision
* The rover shall **with probability < 0.01** eventually satisfy battery_depleted
