% // *****************************************************************************
% // Notices:
% //
% // Copyright � 2019 United States Government as represented by the Administrator
% // of the National Aeronautics and Space Administration.  All Rights Reserved.
% //
% // Disclaimers
% //
% // No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
% // ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
% // TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
% // ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
% // OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
% // ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
% // THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
% // ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
% // RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
% // RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
% // DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
% // PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
% //
% // Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
% // THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
% // ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
% // ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
% // INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
% // USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
% // UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
% // PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
% // ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
% // AGREEMENT.
% // *****************************************************************************

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
        ir_struct =  fret_subsystems_struct(file_name, ir_struct);
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
    json_model = jsonencode(ir_struct);
    json_model = strrep(json_model,'\/','/');
    % essayer d'enlever le escape des slash si possible pour l'esthétique

    % To save the json in a file :
    if nargin < 2
        output_dir = parent;
    end
    if df_export
        file_json = [file_name '_forFRET.json'];
        % Open or create the file
        file_path = fullfile(output_dir, file_json);
        fid = fopen(file_path, 'w');
        % Write in the file
        fprintf(fid, '%s\n', json_model);
        fclose(fid);
    end
end


function ir_struct = fret_subsystems_struct( block_path, ir_struct )
    blockTypesFret = {'Inport', 'Outport'};
    content = find_system(block_path, 'LookUnderMasks', 'all', 'FollowLinks', 'on');

    % IR of all blocks contained in the subsystem or block_diagram
    for i=1:numel(content)
        try
            blkType = get_param(content{i}, 'BlockType');
        catch
            continue;
        end
        if ismember(blkType, blockTypesFret)
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
