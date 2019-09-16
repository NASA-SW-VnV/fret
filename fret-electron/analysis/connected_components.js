export function get_test_contract(){

            var test_contract = {"componentName":"TestComp",
                             "assignments":["o_2 + i_2", "o_3 * i_3", "4*i_4", "10+o_4", "o_6 + i_6", "o_7 + 10"],
                             "delays":[],
                             "inputVariables":[],
                             "internalVariables":[{"name":"i_1"},
                                                  {"name":"i_2"},
                                                  {"name":"i_3"},
                                                  {"name":"i_4"},
                                                  {"name":"i_5"},
                                                  {"name":"i_6"}],
                             "modes":[],
                             "outputVariables":[{"name":"o_1"},
                                                {"name":"o_2"},
                                                {"name":"o_3"},
                                                {"name":"o_4"},
                                                {"name":"o_5"}, 
                                                {"name":"o_6"},
                                                {"name":"o_7"}],

                             "properties": [{"reqid":"p_1", "value":"o_1 + i_1"},
                                            {"reqid":"p_2", "value":"o_5 + i_5"},
                                            {"reqid":"p_3", "value":"i_5 * 10"},
                                            {"reqid":"p_4", "value":"5*i_6"},
                                            {"reqid":"p_5", "value":"5*i_4"}]
                   
            }; 

return test_contract;
}


export function compute_connected_components(contract, output_dep_map){
    /* @input contract: A contractr with the same structure as test_contract
     * above.
     * @input output_dep_map: Output dependency map. Maps a property to the
     * set of outputs it depends on.
     * @returns A list of connected components of form: 
     * cc={"properties":{}, "outputs":{}}
     * */

    
    var disjoint_list = new Array();
    var has_intersection = false;  

    for(var prop of contract['properties']){
        
        var dep_set = output_dep_map[prop.reqid];
 
        if(disjoint_list.length == 0){

            var connected_component = {"properties": new Set(), "outputs": dep_set};
            connected_component.properties.add(prop.reqid); // Need to add because using a 
                                                            // string in a Set constructor
                                                            // will characterize the string.
            disjoint_list.push(connected_component);
                       
        }else{

            for(var connected_component of disjoint_list){

                var intersection = set_intersection(connected_component['outputs'], dep_set);
                if(intersection.size > 0 ){
                    connected_component['properties'].add(prop.reqid);
                    connected_component['outputs'] = set_union(dep_set, 
                                                               connected_component['outputs']);
                   
                    has_intersection = true;
                    break;
                }
            }

            if(!has_intersection){
                var connected_component = {"properties": new Set(), "outputs": dep_set};
                connected_component.properties.add(prop.reqid);

                disjoint_list.push(connected_component);
            }
        }

        has_intersection = false;
    }
    return disjoint_list;
}

export function compute_dependency_maps(contract){
    /* @input contract 
     * @returns maps: {'internal':internal_dep_map, 'output':output_dep_map} 
     * Returns mappings from property to dependent internal and output variables
     * */

    var output_dep_map = {}; 
    var internal_dep_map = {};
    var assignment_map = {}; 
    var mappings = {'internal':internal_dep_map, 'output':output_dep_map}

    // Initalize maps
    for(var prop of contract['properties']){
        output_dep_map[prop.reqid]   = new Set();
        internal_dep_map[prop.reqid] = new Set();
    }
    for(var int_var of contract['internalVariables']){
        output_dep_map[int_var.name]   = new Set();
        internal_dep_map[int_var.name] = new Set();
    }

    // Create assignment map
    for(var i = 0; i < contract['internalVariables'].length; i++){
        var int_var_name = contract['internalVariables'][i].name;
        var assignment_value = contract['assignments'][i];

        assignment_map[int_var_name] = assignment_value; 
    }


    // Get 1st step dependencies
    for(var int_var of contract['internalVariables']){ 
        //var int_var = contract['internalVariables'][i];

        check_assignment_include(assignment_map[int_var.name], contract['outputVariables'], 
                      int_var.name, output_dep_map);
        check_assignment_include(assignment_map[int_var.name], contract['internalVariables'], 
                      int_var.name, internal_dep_map);
    }

    // Close the dependencies
    for(var int_var of contract['internalVariables']){

        compute_output_dependencies(int_var.name, internal_dep_map, output_dep_map, false);
    }    
    
    // Get 1st level dependencies
    for(var prop of contract['properties']){

        // 1st step dependencies 
        check_assignment_include(prop.value, contract['outputVariables'], prop.reqid, 
                                 output_dep_map);
        check_assignment_include(prop.value, contract['internalVariables'], prop.reqid, 
                                 internal_dep_map);
    }

    // Close the dependencies
    for(var prop of contract['properties']){

        // All internal variable dependencies are complete so we only need
        // to compute the 1st level of dependence
        compute_output_dependencies(prop.reqid, internal_dep_map, output_dep_map, true);
    }

    return mappings;
}

export function set_union(setA, setB){
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function set_intersection(setA, setB) {
    var _intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

export function compute_output_dependencies(var_name, internal_dep_map, output_dep_map, one_level){
    /* Recursively compute the outputs that var_name depends on.
     *
     * @input var_name: variable for which to compute output dependencies 
     * @input internal_dep_map: Maps variables to their internal
     * dependencies
     * @input output_dep_map: Maps variables to their output dependencies
     * @input one_level: Boolean to compute only one level of dependencies
     * */

    for(var int_var of internal_dep_map[var_name]){
        

        if(!one_level){ 
            compute_output_dependencies(int_var, internal_dep_map, output_dep_map);
        }

        // Add next level output dependency
        output_dep_map[var_name] = set_union(output_dep_map[var_name], 
                                             output_dep_map[int_var]); 

    }
}

export function check_assignment_include(assignment_value, vars_to_check, key, map){
    /* Checks is any var in vars_to_check are included in assignment_value. 
     * If var is included the var  is added to the set map[key].
     *
     * @input assignment_value: String containing a variable's assignment
     * @input vars_to_check: List of variables to check inclusion with
     * assignment_value 
     * @input key: key use
     * @input map: map[key] is a set that will save the variable if it exists in
     * assignemnt_value
     * */

    for(var variable of vars_to_check){
        if(assignment_value.includes(variable.name)){
            map[key].add(variable.name);
        }
    }
}

