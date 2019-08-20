import os
import networkx as nx
from networkx.drawing.nx_agraph import write_dot
#import matplotlib.pyplot as plt



req_list   = ["FSM-006", "FSM-007"] 
input_list = ["standby", "apfail", "supported", "limits"] 
output_list = ["pullup", "MODE", "good"]
state_list = ["ap_transition_state", "ap_nominal_state", "ap_maneuver_state",\
              "ap_standby_state"]

#state_input_list  = ["state:"+state for state in state_list]
#state_output_list = ["STATE:"+state for state in state_list]
state_input_list = ["state"]
state_output_list = ["STATE"]

FSM001_edges = [("FSM-001", "limits"),\
                 ("FSM-001", "standby"),\
                 ("FSM-001", "pullup"),\
                 ("FSM-001", "apfail")]


FSM002_edges = [("FSM-002", "state"),\
                 ("FSM-002", "STATE"),\
                 ("FSM-002", "standby")]

FSM003_edges = [("FSM-003", "state"),\
                 ("FSM-003", "STATE"),\
                 ("FSM-003", "supported"),\
                 ("FSM-003", "good")]

FSM004_edges = [("FSM-004", "state"),\
                 ("FSM-004", "STATE"),\
                 ("FSM-004", "standby"),\
                 ("FSM-004", "good")]


FSM005_edges = [("FSM-005", "state"),\
                 ("FSM-005", "STATE"),\
                 ("FSM-005", "standby")]

FSM006_edges = [("FSM-006", "state"),\
                 ("FSM-006", "STATE"),\
                 ("FSM-006", "standby"),\
                 ("FSM-006", "good")]

FSM007_edges = [ ("FSM-007", "state"),\
                 ("FSM-007", "STATE"),\
                 ("FSM-007", "supported"),\
                 ("FSM-007", "good")]

FSM008_edges = [ ("FSM-008", "state"),\
                 ("FSM-008", "STATE"),\
                 ("FSM-008", "standby")]

FSM009_edges = [ ("FSM-009", "state"),\
                 ("FSM-009", "STATE"),\
                 ("FSM-009", "apfail")]



G = nx.Graph()

G.add_nodes_from(req_list)
G.add_nodes_from(input_list)
G.add_nodes_from(output_list)
G.add_nodes_from(state_output_list)
G.add_nodes_from(state_input_list)

G.add_edges_from(FSM001_edges)
G.add_edges_from(FSM002_edges)
G.add_edges_from(FSM003_edges)
G.add_edges_from(FSM004_edges)
G.add_edges_from(FSM005_edges)
G.add_edges_from(FSM006_edges)
G.add_edges_from(FSM007_edges)
G.add_edges_from(FSM008_edges)
G.add_edges_from(FSM009_edges)

flattened_edges = list(sum(G.edges,()))

to_remove = []
for node in G.nodes:
    if(node not in flattened_edges):
        to_remove.append(node)

for node in to_remove:
    G.remove_node(node)
        

pos = nx.spring_layout(G)
pos_higher = {}
for k,v in pos.items():
    pos_higher[k] = (v[0], v[1]+10)


write_dot(G, "fsm.dot")
os.system('dot -Tpng fsm.dot -o fsm.png')


## MATPLOTLIB Drawing
#plt.figure()
#nx.draw_spring(G, with_labels=True, font_weight='bold')
#plt.show()
