% // Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
% // 
% // The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
% // 
% // Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

% If you want to use this on a model with CoCoSim contracts, start CoCoSim first.


function [ir_struct, json_model] = fret_IR( model_full_path, output_dir )

    %% Initialisation

    df_export = true;

    load_system(model_full_path);
    [parent, file_name, ~] = fileparts(model_full_path);
    %% Construction of the internal representation
    ir_struct = {};
    meta.file_path = model_full_path;

    %Removed the data info for now
    meta.date = datestr(datetime('today'));
    % First object is Meta information.
    meta.Declarations = buildDeclarationsStruct(file_name);
    ir_struct{1} = meta;

    % launch of the simulation of the model to get the compiled values.

    try
        Cmd = [file_name, '([], [], [], ''compile'');'];
        eval(Cmd);
        %ir_struct.meta.sampleTime = get_BlockDiagram_SampleTime(file_name);
    catch
        error('Simulation of the model failed. The model doesn''t compile.');
    end

    try
        systemChoice = chooseSubsystem(file_name);
        ir_struct =  fret_subsystems_struct(systemChoice, ir_struct);
    catch
        Cmd = [file_name, '([], [], [], ''term'');'];
        eval(Cmd);
    end
    %% Stop the simulation
    try
        Cmd = [file_name, '([], [], [], ''term'');'];
        eval(Cmd);
    catch
        %do nothing
    end



    %% Saving the json ir
    releaseValue = string(version('-release'));
    if releaseValue < "2021a"
        json_model = jsonencode(ir_struct);
    else
        json_model = jsonencode(ir_struct, PrettyPrint=true);
    end
    json_model = strrep(json_model,'\/','/');
    % essayer d'enlever le escape des slash si possible pour l'esthétique

    % To save the json in a file :
    if nargin < 2
        output_dir = parent;
    end
    if df_export
        file_json = [get_param(systemChoice, 'Name') '_forFRET.json'];
        % Open or create the file
        file_path = fullfile(output_dir, file_json);
        [fid, message] = fopen(file_path,'w');
        if fid < 0
            error('Failed to open file %s. Message: %s\n', file_path, message);
        end
        % Write in the file
        fprintf(fid, '%s\n', json_model);
        fclose(fid);
    end
end

function [choice] = chooseSubsystem(file_name)

    %% Find all non-mask (Sub)systems and prompt user to select target as root.

    content = find_system(file_name, 'LookUnderMasks', 'all', 'FollowLinks', 'on','BlockType','SubSystem');
    
    promptList="\n\nList of Subsystems:\n------------------------\n\n";
    numOfSubSystems = numel(content);
    count=1;
    for i=1:numOfSubSystems
        if isempty(Simulink.Mask.get(content{i}))
            promptList = strcat(promptList, int2str(count), ': ', content{i}, '\n');
            count = count+1;
        end
    end
    
    indexChoice = input(strcat(promptList, "\n------------------------\n\n", sprintf('Select subsystem from the list above (index value) [default: 1]: ')));
    if isempty(indexChoice)
        indexChoice = 1;
    end
    while ~ (isfinite(indexChoice) & indexChoice == floor(indexChoice) & indexChoice >=1 & indexChoice <= numOfSubSystems)
        indexChoice = input('Incorrect value entered. Please provide an option from the list using the corresponding integer index value [default: 1]: ');
    end

    choice = content{indexChoice};
end

function ir_struct = fret_subsystems_struct( block_path, ir_struct )
    blockTypesFret = {'Inport', 'Outport'};
    
    %Andreas: Removing recursive option as it is not currently needed.
    %Ask user if they want to recursively retrieve all the information, starting with the selected (Sub)system as root.
    % recursiveChoice = upper(input('Apply recursively? Y/N [default: N]: ','s'));
    % if isempty(recursiveChoice)
    %     recursiveChoice = 'N';
    % end

    % if ~ (recursiveChoice == 'Y' | recursiveChoice == 'N')
    %   recursiveChoice = 'N';  
    % end

    % if recursiveChoice == 'Y'
    %     content = find_system(block_path, 'LookUnderMasks', 'all', 'FollowLinks', 'on');
    % else
    
    content = find_system(block_path, 'SearchDepth', 1, 'LookUnderMasks', 'all');

    % IR of all blocks contained in the subsystem or block_diagram
    for i=1:numel(content)
        try
            blkType = get_param(content{i}, 'BlockType');
            isParentNotMask = isempty(Simulink.Mask.get(get_param(content{i}, 'Parent')));
        catch
            continue;
        end
        if ismember(blkType, blockTypesFret) & isParentNotMask
            ir_struct{end+1} = fret_common_struct(content{i});
        end

    end

end


function [ S ] = fret_common_struct( block_path )

    %% Construction of the internal representation
    S = struct();

    S.id = block_path; %origin_path of the block
    S.project = '';
    S.modeldoc = true;
    S.variable_name = get_param(block_path, 'Name');
    S.portType = get_param(block_path, 'BlockType');
    S.component_name = get_param(block_path, 'Parent');
    S.tool = 'Simulink';


    %% Common properties added
    values = {'CompiledPortDataTypes', 'CompiledPortDimensions', 'CompiledPortWidths'};
    new_names = {'dataType', 'dimensions', 'width'};
    for i=1:numel(values)
        v = get_param(block_path, values{i});
        if isequal(S.portType, 'Inport')
            S.(new_names{i}) = v.Outport;
        elseif isequal(S.portType, 'Outport')
            S.(new_names{i}) = v.Inport;
        end
    end


end


function [declarations] = buildDeclarationsStruct(file_name)
    %getDeclarations returns an object that describes enumerations and
    % bus objects defined in the model

    %https://www.mathworks.com/help/simulink/ug/migrate-enumerated-types-into-data-dictionary.html

    % Find all variables and enumerated types used in model blocks

    usedTypesVars = Simulink.findVars(bdroot(file_name),'IncludeEnumTypes',true);
    % Here, EnumsReporting is the name of the model and
    % usedTypesVars is an array of Simulink.VariableUsage objects

    % Find indices of enumerated types that are defined by MATLAB files or P-files
    enumTypesFile = strcmp({usedTypesVars.SourceType},'MATLAB file');

    % Find indices of enumerated types that are defined using the function
    % Simulink.defineIntEnumType
    enumTypesDynamic = strcmp({usedTypesVars.SourceType},'dynamic class');

    % In one array, represent indices of both kinds of enumerated types
    enumTypesIndex = enumTypesFile | enumTypesDynamic;

    % Use logical indexing to return the names of used enumerated types
    enumTypeNames = {usedTypesVars(enumTypesIndex).Name}';

    % initialize declarations
    declarations.Enumerations = cell(length(enumTypeNames), 1);

    % build a struct for each enum
    for i = 1 : length(enumTypeNames)
        declarations.Enumerations {i} = buildEnumStruct(enumTypeNames{i});
    end
end

function enumStruct = buildEnumStruct(enumTypeName)

    % get the name of the enum
    enumStruct.Name = enumTypeName;

    metadata = meta.class.fromName(enumTypeName);

    % get the default value

    if ismethod(enumTypeName,'getDefaultValue')
        cmd = [enumTypeName '.getDefaultValue()'];
        enumStruct.DefaultValue = char(eval(cmd));
    else
        enumStruct.DefaultValue = metadata.EnumerationMemberList(1).Name;
    end

    enumStruct.Members = cell(length(metadata.EnumerationMemberList), 1);

    % get the members of the enum
    for i = 1 : length(metadata.EnumerationMemberList)
        enumStruct.Members{i}.Name = metadata.EnumerationMemberList(i).Name;
        cmd = ['int32(' enumTypeName '.' enumStruct.Members{i}.Name ')'];
        enumStruct.Members{i}.Value = eval(cmd);
    end
end
