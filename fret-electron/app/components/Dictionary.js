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
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const db = require('electron').remote.getGlobal('sharedObj').db;

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

const variableTypes = ['Mode', 'Inputs', 'Outputs', 'Internal', 'Undefined'];

class Dictionary extends React.Component {

  state = {
    components: [],
    selectedComponent: '',
    checked: { Mode: true, Inputs: true, Outputs: true, Internal: true,  Undefined: true},
    filteredVariables: []
  }

  componentDidMount = () => {
    this.getComponents();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.projectName !== this.props.projectName) {
      this.getComponents();
      this.setState({selectedComponent: ''})
    }
    if(prevState.selectedComponent !== this.state.selectedComponent || prevState.checked !== this.state.checked){
      this.filterVariables();
    }
    if(prevState.filteredVariables !== this.state.filteredVariables){
      this.props.setAutoFillVariables(this.state.filteredVariables.map(variable => variable.name));
    }
  }

  getComponents = async () => {
    const { projectName } = this.props;
    const project = await db.find({
      selector: {
        project: projectName,
      }
    });
    const components_names = {};
    project && project.docs.forEach(function (req) {
      const component_name = req.semantics && req.semantics.component_name;
      if (component_name && !components_names[component_name]) {
        components_names[component_name] = [];
      }
    });
    const components = await modeldb.find({
      selector: {
        project: projectName,
        component_name: { $in: Object.keys(components_names) }
      }
    });
    components && components.docs && components.docs.forEach(comp => {
      const variable = {
        name: comp.variable_name || '',
      };
      if(comp.idType){
        variable['variable type'] = comp.idType;
      }
      if(comp.dataType){
        variable['data type'] = comp.dataType;
      }
      if(comp.assignment){
        variable['assignment'] = comp.assignment;
      }
      if(comp.modelComponent){
        variable['modelComponent'] = comp.modelComponent;
      }
      if(comp.modeldoc_id){
        variable['modeldoc_Id'] = comp.modeldoc_id;
      }
      if(comp.description){
        variable['description'] = comp.description;
      }
      if(comp.reqs){
        variable['reqs'] = comp.reqs.join(', ');
      }
      components_names[comp.component_name].push(variable);
    })
    this.setState({ components: components_names})
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
    const {components, selectedComponent, checked} = this.state;
    const checkedVariableTypes = Object.keys(checked).filter(variableType => checked[variableType]);
    const filteredVariables = selectedComponent ? components[selectedComponent].filter(variable => checked.Undefined && !variable['variable type'] || checkedVariableTypes.includes(variable['variable type'])).sort(this.sortFunction): [];
    this.setState({filteredVariables})
  }

  sortFunction = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  }
  


  render() {
    const { classes } = this.props;
    const { selectedComponent, checked, filteredVariables } = this.state;
    return (
      <div>
        <FormControl>
          <Typography>Component</Typography>
          <Select
            classes={{ root: classes.selectRoot }}
            onChange={this.handleComponentChange}
            value={selectedComponent}
          >
            {Object.keys(this.state.components).map(componentName =>
              <MenuItem key={componentName} value={componentName}>{componentName}</MenuItem>
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
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
          >
            {filteredVariables.map((variable) => {
              const {name} = variable;
              const variableAttributes = {...variable};
              delete variableAttributes.name;
              delete variableAttributes.modeldocId;
              return (<TreeItem key={name}
                        nodeId={name}
                        label={name}
                        classes={{ group: classes.treeItemGroup, selected: classes.selected, label: classes.itemLabel, content: classes.content }}>
                {Object.entries(variableAttributes).map(([key, value]) =>
                  <TreeItem nodeId={`${key}: ${value}`}
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

export default withStyles(styles)(Dictionary);
