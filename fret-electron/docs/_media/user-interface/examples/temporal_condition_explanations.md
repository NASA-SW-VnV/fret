Temporal Condition Documentation
--------------------------------

> __Important Note:__ [Restrictions](../restrictions.md)

This document describes temporal operators about values at previous time
points, persistence or occurrence of conditions, and conditions holding at
the next or previous occurrences of conditions. 

### Previous

There are three operators that return the value of an expression at the
previous timepoint. FRET only formalizes them in past-time. The operators
are `preBool(initBool,p)`, `preInt(initInt,n)` and
`preReal(initReal,x)`. Here `p`, `n`, and `x` are expressions of type
boolean, integer, and real, respectively. These operators return the value
of `p`, `n`, and `x`, respectively, at the previous timepoint. If the
operator is evaluated at the start of the trace, where there is no previous
timepoint, the value of the first argument is returned; i.e., `initBool`,
`initInt` and `initReal`, which are expressions of type boolean, integer and
real, respectively.

### Persistence and Occurrence

There are four special predicates about persistence and occurrence of
conditions that can be used in boolean expressions. FRET can formalize two
of the predicates only in past-time metric temporal logic, and two only in
future-time metric temporal logic. The past-time predicates appear
unformalized in the future-time formalization of the requirement; similarly,
the future-time predicates appear unformalized in the past-time
formalization of the requirement.
 
The past-time predicates are `persisted(n,p)` and `occurred(n,p)`. Here `p`
is any boolean expression, which may include temporal predicates itself. The
predicate `persisted` means that `p` has held true for the previous `n` time
points, as well as the current time point, in the current scope interval. So
*persisted(2,temp > high)* means that *temp* has been greater than *high* at
the current timepoint, and at the previous timepoint, and at the timepoint
previous to that, for a total of three timepoints within the current
scope. If this is evaluated too close to the beginning of the scope; for
example, at the second timepoint of the scope, *persisted* cannot be
satisfied because there aren't two previous timepoints where the proposition
could hold.) The predicate `occurred(n,p)` means that the proposition `p`
held at least once in the previous `n` time points. So *occurred(2,p)* means
that `p` either holds at the current time point, or at the previous time
point, or at the time point previous to that. The combination *occurred(4,p)
& persisted(3,!p)* holds if *p* was true 4 timepoints previously and not
since then.

One subtlety: for the requirement *when occurred(7,p), the sw shall
immediately satisfy r*, *r* will be required to be true when *p* occurs for
the first time, because that is the first time that *occurred(7,p)* becomes
true from false. To say that something shall occur for 7 seconds, use
`occurred` in the response, e.g.: *the sw shall always satisfy if
occurred(7,temp > high) then alarm*. The Simulator is a big help in
understanding the semantics.

The future-time predicates are `persists(n,p)` and `occurs(n,p)`. The
predicate `persists(n,p)` means that the proposition `p` holds for the next
`n` timepoints. So *persists(2, temp > high)* means that *temp* is greater
than *high* at the current time point, the next timepoint, and the timepoint
after that. For example, consider the requirement *when persists(2,temp >
high) the device within 3 ticks shall satisfy alarm*, and suppose *temp* is
greater than *high* at timepoints 3, 4, and 5. In this case, *alarm* must
occur within three timepoints of timepoint 3; i.e., at 3, 4, 5 and/or 6. The
predicate `occurs(n,p)` means that the proposition `p` holds at least once
in the following `n` timepoints. So *occurs(2,p)* means that *p* holds
either at the current timepoint, or at the next timepoint, or at the
timepoint after that.

Another subtlety: The persist predicate never holds over an entire finite
interval. For example, the requirement *Before mode m the software shall
always satisfy persists(3, p)* is never satisfied because the `persists`
predicate can't be satisfied within 2 timepoints of the right end of the
scope interval.

### Next and Previous Occurrences

There are two predicates that specify a condition on the next or previous
occurrence of a condition. The formula `nextOcc(p,q)` means that the next
time the Boolean expression `p` holds in the scope, the Boolean expression
`q` holds at that time as well. Analogously, `prevOcc(p,q)` means that at
the previous occurrence of `p` in the scope, `q` holds. If p doesn't hold in
the scope, the predicates are satisfied vacuously.  As with
persists/persisted, nextOcc is only formalized in future-time temporal logic
and prevOcc is only formalized in past-time temporal logic.

There are also ways to specify these predicates in FRETish in a more natural
language: `at the next occurrence of p, q` and `at the previous occurrence
of p, q`.
