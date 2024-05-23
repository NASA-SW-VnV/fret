// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
import React from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import PropTypes from 'prop-types';
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {ipcRenderer} from "electron";
import {setGlossaryProjectRequirements, setGlossaryVariables
} from "../reducers/allActionsSlice";
import {connect} from "react-redux";

const styles = theme => ({
  treeItemGroup: {
    backgroundColor: 'white',
  },
  itemLabel: {
    background: 'none !important',
  },
  selected: {
    background: 'none !important',
  },
  itemContent: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  selectRoot: {
    minWidth: 200,
  },
  variableTypesCheckboxes:{
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: '0px !important',
  },
  checkBoxFont: {
    fontSize: 12,
  },
  content: {
    cursor: 'default',
  }
});

const variableTypes = ['Mode', 'Input', 'Output', 'Internal', 'Undefined'];

class Glossary extends React.Component {

  state = {
    componentsWithVariables: [],
    components: [],
    selectedComponent: '',
    checked: { Mode: true, Input: true, Output: true, Internal: true,  Undefined: true},
    filteredVariables: [],
  }

  componentDidMount = () => {
    this.getProjectRequirements();
    this.getVariables();
    if (process.env.EXTERNAL_TOOL == '1') {
      this.setVariablesToComponents();
    }
    }

  createMapDbIdToReqId = () => {
    const { projectRequirements } = this.props;
    const mapDbIdToReqId = {}
    projectRequirements.forEach(req => {
      mapDbIdToReqId[req._id] = req.reqid;
      mapDbIdToReqId[req.reqid] = req.reqid;
    })
    return mapDbIdToReqId;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.projectName !== this.props.projectName) {
      this.getProjectRequirements();
      this.getVariables();
      this.setState({selectedComponent: ''})
    }
    if(prevState.selectedComponent !== this.state.selectedComponent || prevState.checked !== this.state.checked){
      this.filterVariables();
    }
    if(prevState.filteredVariables !== this.state.filteredVariables){
      this.props.setAutoFillVariables(this.state.filteredVariables.map(variable => variable.name));
    }
    if(this.props.projectRequirements !== prevProps.projectRequirements) {
      this.setComponentsNames();
    }
    if(this.props.variables !== prevProps.variables || this.props.projectRequirements !== prevProps.projectRequirements ||  process.env.EXTERNAL_TOOL == '1' && this.props.editVariables !== prevProps.editVariables) {
      this.setComponentsNames();
      this.setVariablesToComponents();
    }
  }

  getProjectRequirements = async () => {
    if(process.env.EXTERNAL_TOOL !=='1'){
      const { projectName } = this.props;
      ipcRenderer.invoke('selectProjectRequirements', projectName).then((result) => {
        this.props.setGlossaryProjectRequirements({
          glossaryProjectRequirements: result.docs
        })
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  getVariables = async () => {
    if (process.env.EXTERNAL_TOOL !== '1') {
      ipcRenderer.invoke('selectGlossaryVariables', [this.props.projectName]).then((result) => {
        //console.log('result', result.docs)
        this.props.setGlossaryVariables({
          glossaryVariables: result.docs
        })
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  setComponentsNames = () => {
    const { projectRequirements } = this.props;
    const components = {};
    projectRequirements.forEach(function (req) {
      const componentName = req.semantics && req.semantics.component_name;
      if (componentName && !components[componentName]) {
        components[componentName] = [];
      }
    });
    this.setState({ components})

  }

  setVariablesToComponents = async () => {
    let variables;
    const componentsWithVariables = {...this.state.components}
    if(process.env.EXTERNAL_TOOL !=='1'){
      variables = this.props.variables
    } else {
      variables = this.props.editVariables.docs;
      // console.log('new editVariables', this.props.editVariables)
      //TODO: now it only works for one component, update.
      componentsWithVariables[variables[0].component_name] = [];
    }
    const mapDbIdToReqId =  this.createMapDbIdToReqId();

    variables && variables.forEach(v => {
      const variable = {
        name: v.variable_name || '',
      };
      if(v.idType){
        variable['variable type'] = v.idType;
      }
      if(v.dataType){
        variable['data type'] = v.dataType;
      }
      if(v.assignment){
        variable['assignment'] = v.assignment;
      }
      if(v.modelComponent){
        variable['modelComponent'] = v.modelComponent;
      }
      if(v.modeldoc_id){
        variable['modelSignal'] = v.modeldoc_id;
      }
      if(v.description){
        variable['description'] = v.description;
      }
      if(v.reqs){
        let variableRequirements = []
        v.reqs.forEach( req => {
          if(mapDbIdToReqId[req]) {
            variableRequirements.push(mapDbIdToReqId[req]);
          }
        })
        variable['reqs'] = variableRequirements.sort().join(', ');
      }
      if(!componentsWithVariables[v.component_name]) {
        componentsWithVariables[v.component_name] = [];
      }
      componentsWithVariables[v.component_name].push(variable);
    })
    this.setState({ componentsWithVariables })
  }

  handleComponentChange = event => {
    const value = event.target.value;
    this.setState({selectedComponent: value})
  }

  handleChange = event => {
    const {target} = event;
    this.setState(prevState => {
      return {checked: {...prevState.checked, [target.name]: target.checked}}});
  }


  filterVariables = () => {
    const {componentsWithVariables, selectedComponent, checked} = this.state;
    const checkedVariableTypes = Object.keys(checked).filter(variableType => checked[variableType]);
    const filteredVariables = selectedComponent ?
      componentsWithVariables[selectedComponent].filter(variable => checked.Undefined && !variable['variable type'] || checkedVariableTypes.includes(variable['variable type'])).sort(this.sortFunction): [];
    this.setState({filteredVariables})
  }

  sortFunction = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  }



  render() {
    const { classes } = this.props;
    const { selectedComponent, checked, filteredVariables, components } = this.state;
    var compMi = this.state.componentsWithVariables;
    if(process.env.EXTERNAL_TOOL !=='1'){
      compMi = components;
    }
    return (
      <div>
        <FormControl>
          <Typography>Component</Typography>
          <Select
            id="qa_gls_sel_comp"
            classes={{ root: classes.selectRoot }}
            onChange={this.handleComponentChange}
            value={selectedComponent}
          >
            {Object.keys(compMi).sort().map(componentName =>
              <MenuItem id={"qa_gls_mi_comp_"+componentName} key={componentName} value={componentName}>{componentName}</MenuItem>
            )
            }
          </Select>
        </FormControl>
        <FormControl className={classes.variableTypesCheckboxes}>
          <Typography>Variable type display</Typography>
          <FormGroup row>
            {variableTypes.map(variableType =>
              <FormControlLabel
                classes={{label: classes.checkBoxFont}}
                key={variableType}

                control={
                  <Checkbox
                    id = {"qa_gls_cb_" + variableType}
                    checked={checked[variableType]}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    onChange={this.handleChange}
                    name={variableType}
                    color="primary"
                  />
                }
                label={variableType}
              />)
            }
          </FormGroup>
        </FormControl>
        <div>
          <TreeView
            id = "qa_gls_tree_var"
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
          >
            {filteredVariables.map((variable) => {
              const {name} = variable;
              const variableAttributes = {...variable};
              delete variableAttributes.name;
              delete variableAttributes.modeldocId;
              return (<TreeItem key={name}
                                id={"qa_gls_ti_var_"+name}
                                nodeId={name}
                                label={name}
                                classes={{ group: classes.treeItemGroup, selected: classes.selected, label: classes.itemLabel, content: classes.content }}>
                {Object.entries(variableAttributes).map(([key, value]) =>
                  <TreeItem nodeId={`${key}: ${value}`}
                            id={"qa_gls_ti_var_reqs_"+name}
                            key={`${key}: ${value}`}
                            label={
                              <div style={{display: 'flex'}}>
                                <Typography>{key}: </Typography>
                                <Typography style={{marginLeft: 4}}>{value}</Typography>
                              </div>}
                            classes={{ group: classes.treeItemGroup, label: classes.itemLabel, content: classes.content }}/>)
                }
              </TreeItem>)
            })
            }
          </TreeView>
        </div>
      </div>)
  }
}

Glossary.propTypes = {
  projectName:PropTypes.string.isRequired,
  setAutoFillVariables: PropTypes.func,
  setGlossaryProjectRequirements: PropTypes.func,
  setGlossaryVariables: PropTypes.func,
  projectRequirements: PropTypes.array,
  variables: PropTypes.array,
  editVariables: PropTypes.object
};


function mapStateToProps(state) {
  const projectRequirements = state.actionsSlice.glossaryProjectRequirements;
  const variables = state.actionsSlice.glossaryVariables;
  return {
    projectRequirements,
    variables
  };
}
const mapDispatchToProps = {
  setGlossaryProjectRequirements,
  setGlossaryVariables,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Glossary));
