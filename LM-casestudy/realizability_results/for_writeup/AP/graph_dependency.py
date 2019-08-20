import os
from ruamel.yaml import YAML
import networkx as nx
from networkx.drawing.nx_agraph import write_dot
#import matplotlib.pyplot as plt



req_list   = ["AP-000", "AP-007"] 
input_list = ["standby", "apfail", "supported", "limits"] 
output_list = ["pullup", "MODE", "good"]
state_list = ["ap_transition_state", "ap_nominal_state", "ap_maneuver_state",\
              "ap_standby_state"]

#state_input_list  = ["state:"+state for state in state_list]
#state_output_list = ["STATE:"+state for state in state_list]
state_input_list = ["state"]
state_output_list = ["STATE"]

# Global
AP000 = [("AP-000", "altitude_hold"),\
                 ("AP-000", "absOf_alt_minus_IC")]


# RollAutopilot
AP001 = [("AP-001", "autopilot_engaged"),\
                 ("AP-001", "roll_actuator_command")]

# RollAutopilot 
AP002 = [("AP-002", "autopilot_engaged"),\
               ("AP-002", "no_other_lateral_mode"),\
               ("AP-002", "roll_hold_mode"),\
               ("AP-002", "roll_cmd"),\
               ("AP-002", "roll_hold_mode_cmd")]


#AP-003 is RollHOld Reference
AP003a = [        ("AP-003a", "roll_hold_reference"),\
                 ("AP-003a", "roll_angle"),\
                 ("AP-003a", "Cc1"),\
                 ("AP-003a", "Cc2"),\
                 ("AP-003a", "TurnKnob"),\
                 ("AP-003a", "at_time_of_roll_hold_engagement")]

AP003b = [("AP-003b", "roll_angle"),\
                 ("AP-003b", "roll_hold_reference"),\
                 ("AP-003b", "at_time_of_roll_hold_engagement")]

AP003c = [("AP-003c", "roll_angle"),\
                 ("AP-003c", "roll_hold_reference"),\
                 ("AP-003c", "at_time_of_roll_hold_engagement")]

AP003d = [("AP-003d", "TurnKnob"),\
                 ("AP-003d", "roll_hold_reference")]






# Autopilot
AP004 = [("AP-004", "roll_hold_mode"),\
                 ("AP-004", "steady_state"),\
                 ("AP-004", "abs_roll_err"),\
                 ("AP-004", "overshoot")]


# Autopilot
AP005 = [("AP-005", "abs_roll_rate")]

# Autopilot
AP006 = [("AP-006", "abs_roll_angle")]

# Roll Autopilot
AP007 = [ ("AP-007", "abs_aileron_cmd")]

# Roll Autopilot
AP008 = [ ("AP-008", "hdg_hold_mode"),\
                 ("AP-008", "hdg_mode_is_active"),\
                 ("AP-008", "roll_cmd"),\
                 ("AP-008", "hdg_hold_mode_cmd")]

# AP-009 Out of scope

# HeadingPerformance
AP010 = [ ("AP-010", "hdg_mode"),\
                 ("AP-010", "hdg_steady_state"),\
                 ("AP-010", "abs_hdg_err")]


property_edge_list = [AP001, AP002, AP003a, AP003b, AP003c,\
                 AP003d, AP004, AP005,\
                 AP006, AP007, AP008, AP010] 

node_set  = set()
edge_list = list() 
for property_edge in property_edge_list:
    for edge in property_edge:
        node_set.add(edge[0])
        node_set.add(edge[1])
        edge_list.append(edge)


node_list = list(node_set)


G = nx.Graph()
G.add_nodes_from(node_list)
G.add_edges_from(edge_list)


write_dot(G, "ap.dot")
os.system('dot -Tpng ap.dot -o ap.png')


# Change position of nodes
#pos = nx.spring_layout(G)
#pos_higher = {}
#for k,v in pos.items():
#    pos_higher[k] = (v[0], v[1]+10)
#

## MATPLOTLIB Drawing
#plt.figure()
#nx.draw_spring(G, with_labels=True, font_weight='bold')
#plt.show()



def main():
    yaml = YAML(typ="safe")

    with open("ap_depend.yaml","r") as dep_tree_file:
        dep_tree = yaml.load(dep_tree_file)
        #print(dep_tree)

    # Get properties(roots)and their dependencies(leafs)
    root_list     =  list(dep_tree.keys())
    leaf_list     =  sum(dep_tree.values(),[]) # Funny way to flatten a
                                               # nested list of lists

    print(root_list)
    print(leaf_list)

    # Everything is considered a node
    node_set      = set(root_list + leaf_list) 
    node_list     = list(node_set)

    # Get the edge relations
    edge_list = list()
    for root in root_list:
        new_edges = [(root, leaf) for leaf in dep_tree[root]]
        edge_list = edge_list + new_edges

    G = nx.Graph()
    G.add_nodes_from(node_list)
    G.add_edges_from(edge_list)

    write_dot(G, "ap.dot")
    os.system('dot -Tpng ap.dot -o ap.png')


       

if __name__ == "__main__":
    main()

