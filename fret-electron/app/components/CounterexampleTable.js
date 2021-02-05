import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

//tooltips for variables in cex table
//hover over requirement => show def. (like in CirclePacking diagram)
//hover over variable => 
//	show <kind> = [input, internal, output] : <type> [int, bool...]
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import { DiagnosisContext } from './DiagnosisProvider';

const tableComponentBarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  componentBar:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  modelRoot: {
     display: 'flex',
     flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 150,
    padding: theme.spacing.unit * -2,
    marginRight: theme.spacing.unit * 2

  },
});

let TableComponentBar = props => {
  const {classes, handleChange, cexConflictName, conflicts, menuItems} = props;  
  
  return(
    <Toolbar className={classNames(classes.root, classes.componentBar)}>
      <form className={classes.formControl} autoComplete="off">
        <FormControl className={classes.modelRoot}>
          <InputLabel htmlFor="component-helper">Counterexample For</InputLabel>
          <Select
            key={cexConflictName=== undefined ? '' : cexConflictName}
            value={cexConflictName}
            onChange={handleChange}
            input={<Input name="component" id="component-helper" />}
          >
            {menuItems}
            })}
          </Select>
        </FormControl>
      </form>
    </Toolbar>
  );
};

TableComponentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  cexConflictName: PropTypes.string.isRequired,
  conflicts: PropTypes.array.isRequired,
  menuItems: PropTypes.array.isRequired
}

TableComponentBar = withStyles(tableComponentBarStyles)(TableComponentBar);

const styles = theme => ({
  root: {
    width: 600,
    height: 400,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  table: {
    maxWidth: 600,
    maxHeight: 500,
    position: 'relative'
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    top: 0
  }
});

class CounterexampleTable extends React.Component {
  static contextType = DiagnosisContext;  

  state = {
  	numberOfSteps : undefined,
  	cex : undefined,
    deps : []
  };

  constructor(props) {
  	super(props);
  	this.state = { 
  		numberOfSteps : this.props.cexTableData[this.props.currentConflicts[0]].K,
		  cexConflictName : this.props.cexTableData[this.props.currentConflicts[0]].props,  		
  		cex : this.props.cexTableData[this.props.currentConflicts[0]].Counterexample,
      deps: this.props.cexTableData[this.props.currentConflicts[0]].Dependencies };
  }

  handleChange = event => {
    this.setState({ 
    	numberOfSteps : this.props.cexTableData[event.target.value].K,
		  cexConflictName : this.props.cexTableData[event.target.value].props,
    	cex : this.props.cexTableData[event.target.value].Counterexample,
    	deps : this.props.cexTableData[event.target.value].Dependencies,
      [event.target.name]: event.target.value
    })
    this.context.setMessage({
      reqs : event.target.value,
      color : this.props.colors[this.props.currentConflicts.indexOf(event.target.value)]
    });
  };

  componentDidUpdate(prevProps) {
  	if (this.props.currentConflicts !== prevProps.currentConflicts) {
  		this.setState({
  			numberOfSteps : this.props.cexTableData[this.props.currentConflicts[0]].K,
  			cexConflictName : this.props.cexTableData[this.props.currentConflicts[0]].props,
  			cex : this.props.cexTableData[this.props.currentConflicts[0]].Counterexample,
        deps : this.props.cexTableData[this.props.currentConflicts[0]].Dependencies
  		});    
  	}

  }

  render() {
  	const {classes, allConflicts, currentConflicts, cexTableData} = this.props;
  	const {numberOfSteps, cex, cexConflictName, deps} = this.state;
  	var menuItems = [];
  	for (var i = 0; i < currentConflicts.length; i++) {
  		menuItems.push(
		(<MenuItem key={i} value={currentConflicts[i]}>
			{/*currentConflicts[i]*/}
      Conflict {allConflicts.indexOf(currentConflicts[i])+1}
			</MenuItem>)
		);
  	}

  	var tableHeaders = [];
  	for (var i = 0; i < numberOfSteps; i++) {
  		tableHeaders.push(
  		(<TableCell className={classes.header} key={i} align="right"> {"Step " + i} </TableCell>)
  		);
  	}

  	var ents = Object.entries(deps)
    const reducer = (accumulator, currentValue) => accumulator.concat(currentValue[1].locals.filter(l => l !== currentValue[0]));
    var locs = [...new Set(ents.reduce(reducer, []))];

  	var tableRows = [];
    
    //Filter out JKind local variables from cex data, then create table row for everything else
    cex.filter(row => !locs.includes(row.name))
       .map(row => (tableRows.push(
          <TableRow key={cex.indexOf(row)}>
            {Object.keys(row).map(function(key, index) {          
              return(<TableCell key={index} align="right"> {row[key].toString()} </TableCell>);
            })}
          </TableRow>))) 
       
    // cex.map(function(row) {
    //   if (!locs.includes(row.name)) {
    //     return (tableRows.push(
    //     <TableRow key={cex.indexOf(row)}>
    //       {Object.keys(row).map(function(key, index) {          
    //         return(<TableCell key={index} align="right"> {row[key].toString()} </TableCell>);
    //       })}
    //     </TableRow>))
    //   }
    // })

		// cex.map(row => (tableRows.push(
		// <TableRow key={cex.indexOf(row)}>
  //   		{Object.keys(row).map(function(key, index) {          
  //     		return(<TableCell key={index} align="right"> {row[key].toString()} </TableCell>);
  //   		})}
  // 		</TableRow>)))  				 	

  	return (
  		<div>
      <Paper className={classes.root}>              
        <TableComponentBar
          handleChange={this.handleChange}
          cexConflictName={cexConflictName}
          conflicts={allConflicts}
          menuItems={menuItems}
        />
				<Table className={classes.table}>
				  <TableHead>
				    <TableRow>
				      <TableCell className={classes.header} align="right">Variable name</TableCell>
				      <TableCell className={classes.header} align="right">Variable type</TableCell>
				      {tableHeaders}
				    </TableRow>
				  </TableHead>
				  <TableBody>
				    {tableRows}
				  </TableBody>
				</Table>
			</Paper>
		</div>
  	);
  }
}

      // <FormControl>
      // <InputLabel htmlFor="component-helper">Counterexample for conflict:</InputLabel>
      // <Select
        // name={cexConflictName}
        // value={cexConflictName}
        // onChange={this.handleChange}
      // >
      // {menuItems}
      // </Select>
      // </FormControl>

CounterexampleTable.propTypes = {
  allConflicts: PropTypes.array.isRequired,  
  currentConflicts: PropTypes.array.isRequired,
  cexTableData: PropTypes.object.isRequired,
  colors: PropTypes.array.isRequired
}

export default withStyles(styles)(CounterexampleTable);
