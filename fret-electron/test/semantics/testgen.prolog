:- use_module(library(clpfd)).
% We ran this under SWI-Prolog 7.6.0-rc1

/*
z(W,X) :- X in 0 .. W, (X #= 0, label([X]); X #= W, label([X]); (0 #< X, X #< W,label([X]),!)).
% findall(X,z(5,X),R),write(R). --> [0,5,1]

z1(W,X) :- X in 0 .. W, (X #= 0, label([X]); (0 #< X, X #< W,label([X]),!); X #= W, label([X])).
% findall(X,z1(5,X),R),write(R). --> [0,1] The ! cuts away the last disjunct. 

mid(W,X) :- (0 #< X, X #< W, label([X]),!).
z2(W,X) :- X in 0 .. W, (X #= 0, label([X]); mid(W,X); X #= W, label([X])).
% findall(X,z2(5,X),R),write(R). --> [0,1,5] The ! in mid doesn't cut the last disjunct in z2.
*/

% X is each end (X1 or X2), the middle of the interval [X1 .. X2], or X1+1.
% X can be thought of as the point where the Condition first becomes true.
x(X1,X2,X) :-
  X #= X1;
  (3 #=< X2 - X1, X #= X1 + 1);  % for x1 + n < x2 below
  (2 #=< X2 - X1, X #= (X1 + X2) div 2);
  X #= X2.

% Select X, Z such that Y is strictly between X and Z.
mid(X,Y,Z) :- X #< Y, Y #< Z, label([X,Y,Z]), !.

lt(X4,Y) :- X4 #< Y, label([X4,Y]), !.

% Generate two intervals related via X, duration N and maximum index Max.
x1234(Max,N,X,X1,X2,X3,X4) :-
  X1 #=< X2, X2 + 2 #=< X3,  X3 #=< X4,
  (X4 #= Max - 2;
   X4 #= Max - 1;
   X4 #= Max),
  Y #= X + N,
  (
  mid(X1,Y,X2);
  Y #= X2;
  mid(X2,Y,X3);
  Y #= X3;
  mid(X3,Y,X4);
  Y #= X4;
  lt(X4,Y)
  ).

% Generate one interval related via X, duration N and maximum index Max.
x12(Max,N,X,X1,X2) :-
    x1234(Max,N,X,X1,X2,Max,Max).

%* Include empty intervals
%* x3 = x4 = end, take only first satisfying intervals
% setof(S,modes(7,4,S),R),write(R),length(R,L).
modes(Max,N,[X,[[X1,X2],[X3,X4]]]) :-
   [X1,X2,X3,X4] ins 0 .. Max,
   x(X1,X2,X),
   x1234(Max,N,X,X1,X2,X3,X4),
   label([X,X1,X2,X3,X4]).
   %indomain(X1),indomain(X2),indomain(X3),indomain(X4),
   %findall([X,X1,X2,X3,X4], label([X,X1,X2,X3,X4]),Ms).

modes(Max,N,[X,[[X1,X2]]]) :-
   [X1,X2] ins 0 .. Max,
   x(X1,X2,X),
   x12(Max,N,X,X1,X2),
   label([X,X1,X2]).

% All relationships between intervals (not metric relationships). 
% https://www.ics.uci.edu/~alspaugh/cls/shr/allen.html

% interval [A,B] precedes [P,Q]
precedes(A,B,P,Q) :-
  A #=< B, P #=< Q,
  B #< P.

meets(A,B,P,Q) :-
  A #=< B, P #=< Q,
  B #= P.

overlaps(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #< P, B #> P, B #< Q.

finishedBy(A,B,P,Q) :-
  A #=< B, P #=< Q,
  B #= Q, A #< P.

contains(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #< P, Q #< B.

starts(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #= P, B #< Q.

equals(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #= P, B #= Q.

startedBy(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #= P, B #> Q.

during(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #> P, B #< Q.

finishes(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #> P, B #= Q.

overlappedBy(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #> P, A #< Q, B #> Q.

metBy(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #= Q.

precededBy(A,B,P,Q) :-
  A #=< B, P #=< Q,
  A #> Q.

intervalRelationship(R) :-
  member(R,[precedes,meets,overlaps,finishedBy,contains,starts,equals,startedBy,during,finishes,overlappedBy,metBy,precededBy]).

% Generate an interval [P,Q] that is related to interval [X1,X2] by interval relationship R;
% i.e. [X1,X2] R [P,Q]
property(Max,R,X1,X2,P,Q) :-
   0 #=< P, Q #=< Max,
   call(R,X1,X2,P,Q),
   label([P,Q]),
   !.   

% Generate an interval [P,Q] related to interval [X1,X2] via an interval relationship.
anInterval(Max,[X1,X2],[P,Q]) :-
  intervalRelationship(R), %write(R),
  property(Max,R,X1,X2,P,Q). %,write_ln([P,Q]).

% Generate intervals in 0..Max that are related to the given interval;
% e.g., intervals(7,[3,5],L).
intervals(Max,[X1,X2],L) :-
  setof(Int,anInterval(Max,[X1,X2],Int),L).

mergeIntersectingIntervals([[X1,X2]],[[X1,X2]]).

mergeIntersectingIntervals([[X1,X2],[X3,X4]],R) :-
    (X1 =< X3 -> (X1a = X1, X2a = X2, X1b = X3, X2b = X4) ;
                 (X1a = X3, X2a = X4, X1b = X1, X2b = X2)),
    (X1b #> X2a + 1 -> R = [[X1a,X2a],[X1b,X2b]] ;
       (Xl is min(X1a,X1b), Xr is max(X2a,X2b), R = [[Xl,Xr]])).

% maplist (see writeSettings) requires a ternary predicate.
writeln3(Ostrm,Strng,_) :- write(Ostrm,Strng),writeln(Ostrm,',').

writeSettings(Filename,Settings) :-
    open(Filename,write,Ostrm),
    %format(string(S),'{ \"testLength\": ~d, \"settings\":',[Max]),
    %writeln(Ostrm,S),
    writeln(Ostrm,'['),
    reverse(Settings,[Last | Rest]),
    reverse(Rest,Front),
    maplist(writeln3(Ostrm),Front,_),
    writeln(Ostrm,Last),
    writeln(Ostrm,']'),
    %writeln(Ostrm,'}'),
    close(Ostrm).

% Generate intervals where mode, condition and post-condition hold.
setting(Max,N,[Max,N,ModeInts,CondInts,PostCondInts]) :-
    modes(Max,N,[X,ModeInts]),
    Xr is min(X+1,Max),
    X2l is min(X+3,Max),
    X2r is min(X+4,Max),
    CondInts = [[X,Xr],[X2l,X2r]],
    maplist(anInterval(Max),ModeInts,RawPCs),
    mergeIntersectingIntervals(RawPCs,PostCondInts).

% Example invocation: genSettings(9,4,'/tmp/settings_9_4.json',Len).
genSettings(Max,N,Filename,Len) :-
    setof(Setting,setting(Max,N,Setting),Settings),
    writeSettings(Filename,Settings),
    length(Settings,Len).

/*
testx(Max,[X,X1,X2]) :-
  [X,X1,X2] ins 0 .. Max,
  X1 #=< X2,
  x(X1,X2,X),
  label([X1,X2]).
*/
