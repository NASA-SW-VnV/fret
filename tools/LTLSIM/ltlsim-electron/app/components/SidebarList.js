// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AtomicIcon from '@material-ui/icons/FontDownloadOutlined';
import FormulaIcon from '@material-ui/icons/Functions';
import HelpIcon from '@material-ui/icons/Help';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExportIcon from '@material-ui/icons/ArrowUpward';
import ImportIcon from '@material-ui/icons/ArrowDownward';
import { withStyles } from '@material-ui/core/styles';

import FormulaRenderer from './FormulaRenderer';

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing.unit * 4
    },
    nestednested: {
        paddingLeft: theme.spacing.unit * 6
    },
    listCheckbox: {
        paddingTop: 0,
        paddingBottom: 0
    },
    tooltip: {
        overflowX: 'hidden'
    }
});

const maxNameLength = 12;

class SidebarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            atomicsOpen : true,
            formulasOpen : true,
            settingsDialogOpen: false
        };

        this.handleToggleAtomicsOpen = this.handleToggleAtomicsOpen.bind(this);
        this.handleToggleFormulasOpen = this.handleToggleFormulasOpen.bind(this);
    }

    handleToggleAtomicsOpen () {
        this.setState((prevState) => (
            {atomicsOpen : !prevState.atomicsOpen})
            )
    }

    handleToggleFormulasOpen () {
        this.setState((prevState) => (
            {formulasOpen : !prevState.formulasOpen})
            )
    }

    render () {
        const {classes, 
                model, 
                visibleAtomics, 
                visibleFormulas, 
                visibleSubformulas,
                selectedFormula,
                settings } = this.props;
        let atomicKeys = model.atomics.keys;
        let formulaKeys = model.formulas.keys;

        let atomicsList = (atomicKeys.length > 0) ? (
            <Collapse
                in={this.state.atomicsOpen && 
                    !this.props.settings.focusOnSelection && 
                    !this.props.settings.displayAtomicsWithFormulas
                    }
                timeout="auto" 
                unmountOnExit >
                <List component="div" disablePadding >
                    {atomicKeys.map((key) => {
                        let longName = key.length > maxNameLength;
                        let listItem = <ListItem 
                            key={'sidebar-atomic-'+key} 
                                button 
                                className={classes.nested}
                                onClick={this.props.onAtomicSelection(key)}>
                                <Checkbox 
                                    checked={visibleAtomics.indexOf(key) !== -1}
                                    className={classes.listCheckbox}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={(longName) ? 
                                    key.slice(0, maxNameLength-2) + "..." : key}/>
                        </ListItem>;

                        return (longName) ? 
                        <Tooltip 
                            title={key} 
                            key={'sidebar-atomic-tooltip-'+key} 
                            placement="right"
                            classes={{tooltip: classes.tooltip}}>
                            {listItem}
                        </Tooltip> : listItem;
                    })}
                </List>
            </Collapse>) : null;

        let formulaList = (formulaKeys.length > 0) ? (
            <Collapse
                in={this.state.formulasOpen}
                timeout="auto" 
                unmountOnExit >
                <List component="div" disablePadding >
                        {formulaKeys.map((key) => {
                            let formula = model.formulas.values[key];
                            let flabel = formula.label.length > maxNameLength ? 
                                formula.label.slice(0, maxNameLength-2) + "..." :
                                formula.label;
                            let subformulaList = (formula.subexpressions.length > 0) ? 
                                <Collapse 
                                    in={this.state.formulasOpen && 
                                        settings.focusOnSelection && 
                                        key === selectedFormula}
                                    timeout="auto" 
                                    unmountOnExit
                                    key={'sidebar-subformula-collapse-'+key} >
                                    <List 
                                        component="div" 
                                        disablePadding
                                        key={'sidebar-subformula-list-'+key} >
                                        {formula.subexpressions.map((s, i) => {
                                            let vs = visibleSubformulas[key];
					 	// PATCH: JSC 082021
					    s.label = s.id;
                                            return (
                                                <div
                                                key={'sidebar-subformula-'+s.label}>
                                                <Tooltip
                                                    title={
                                                        <FormulaRenderer tex={s.tex} />
                                                    }
                                                    placement="right"
                                                    classes={{tooltip: classes.tooltip}}>
                                                <ListItem 
                                                    button 
                                                    className={classes.nestednested}
                                                    onClick={this.props.onFormulaSelection(key, i)}>
                                                    <Checkbox 
                                                        checked={vs && vs.indexOf(i) !== -1}
                                                        className={classes.listCheckbox}
                                                        tabIndex={-1}
                                                        disableRipple
                                                    />
                                                    <ListItemText primary={(s.label.length > maxNameLength-2) ? 
                                                            s.label.slice(0, maxNameLength-4)+"..." : s.label}/>
                                                </ListItem>
                                                </Tooltip>
                                            </div>
                                        )})}
                                    </List>
                                </Collapse>
                                : null;
                            return (<div 
                                key={'sidebar-formula-'+key} >
                                <Tooltip 
                                    title={
                                        <FormulaRenderer tex={formula.tex} />
                                    }
                                    placement="right"
                                    classes={{tooltip: classes.tooltip}}>
                                <ListItem 
                                    button 
                                    className={classes.nested}
                                    onClick={this.props.onFormulaSelection(key)}>
                                    <Checkbox 
                                        checked={visibleFormulas.indexOf(key) !== -1}
                                        className={classes.listCheckbox}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText primary={flabel}/>
                                </ListItem>
                                </Tooltip>
                            {subformulaList}</div>)
                        }
                    )}
                </List>
            </Collapse>) : null;
        return (
            <div>
                <List component="nav">
                    {(!this.props.settings.focusOnSelection && 
                    !this.props.settings.displayAtomicsWithFormulas) && 
                        (<ListItem  button >
                            <ListItemIcon>
                                <AtomicIcon />
                            </ListItemIcon>
                            <ListItemText primary="Atomics"/>
                            {(atomicKeys.length > 0) &&
                                (this.state.atomicsOpen ? 
                                <ExpandLessIcon onClick={this.handleToggleAtomicsOpen} color="primary"/> : 
                                <ExpandMoreIcon onClick={this.handleToggleAtomicsOpen} color="primary"/>)}
                        </ListItem>)}
                    {atomicsList}
                    <ListItem  button >
                        <ListItemIcon>
                            <FormulaIcon />
                        </ListItemIcon>
                        <ListItemText primary="Formulas"/>
                        {formulaKeys.length > 0 && (this.state.formulasOpen ? 
                            <ExpandLessIcon onClick={this.handleToggleFormulasOpen} color="primary"/> : 
                            <ExpandMoreIcon onClick={this.handleToggleFormulasOpen} color="primary"/>)}
                    </ListItem>
                    {formulaList}
                </List>
                {/* TODO: implement import, export and help 
                <Divider />
                <List>
                    <ListItem 
                        button  >
                        <ListItemIcon>
                            <ImportIcon />
                        </ListItemIcon>
                        <ListItemText primary="Import" />
                    </ListItem>
                    <ListItem 
                        button  >
                        <ListItemIcon>
                            <ExportIcon />
                        </ListItemIcon>
                        <ListItemText primary="Export" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button >
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItem>
                </List> */}
            </div>
        )
    }
}

SidebarList.propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    visibleAtomics: PropTypes.array.isRequired,
    visibleFormulas: PropTypes.array.isRequired,
    visibleSubformulas: PropTypes.object.isRequired,
    selectedFormula: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onAtomicToggle: PropTypes.func,
    onFormulaToggle: PropTypes.func,
    onFormulaSelection: PropTypes.func,
    onAtomicSelection: PropTypes.func
};

SidebarList.defaultProps = {
    visibleSubformulas: []
}

export default withStyles(styles)(SidebarList);
