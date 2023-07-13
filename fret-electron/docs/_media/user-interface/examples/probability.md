#### Probability (mandatory)

Specifies the probability assigned to the response field. 

Supported options are:
* **with probability** RELATIONAL_OP prob_num, which requires that the probability is above or below a given bound.
* **with what probability**, which queries the probability bound or range such that the response is satisfied.



Examples:
* robot shall with probability > 0.2 always satisfy action
* robot shall with what probability always satisfy action

