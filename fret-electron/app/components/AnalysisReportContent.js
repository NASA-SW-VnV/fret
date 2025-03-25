// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fade from '@material-ui/core/Fade';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TabContainer, ResultIcon } from './RealizabilityContent';
import DiagnosisRequirementsTable from './DiagnosisRequirementsTable';
import DiagnosisProvider from './DiagnosisProvider';
import ChordDiagram from './ChordDiagram';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2),
  }
});


class AnalysisReportContent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selected: '',
      ccSelected: '',
      monolithic: false,
      compositional: false
    }
    this.loadNewReportInput = React.createRef();
  }

	componentDidUpdate(prevProps) {
		if (this.props.importedReport !== prevProps.importedReport) {
			this.setState({
				selected: '',
				ccSelected: '',
				monolithic: false,
				compositional: false
			})
		}
	}

	handleChange = name => event => {
	    if (name === 'selected') {
	      	let isDecomposable = event.target.value.compositional.connectedComponents.length > 1;
	        this.setState({
	        	selected: event.target.value,
	        	ccSelected: isDecomposable ? 'cc0' : '',
	        	monolithic: !isDecomposable,
	        	compositional: isDecomposable
	        });
	    } else if (name === 'monolithic' && !this.state.monolithic) {
	      this.setState({monolithic : !this.state.monolithic, compositional : false});
	    } else if (name === 'compositional' && !this.state.compositional) {
	      this.setState({monolithic : false, compositional : !this.state.compositional});
	    }
	}

	handleCCChange = (event, value) => {
	    this.setState({ccSelected: value});
	};

	render() {
		const { classes, importedReport, handleLoadClick } = this.props;
		const { selected, ccSelected, monolithic, compositional } = this.state;

		let tabs = [];
		let diagStatus, diagReport, connectedComponentIndex;
		let selectedProject = importedReport.projectName;

		if (selected !== '') {
			if (compositional) {
				for (const cc of selected.compositional.connectedComponents) {
					tabs.push(
						<Tab
							key={cc.ccName}
							value={cc.ccName}
							label={
								<div key={cc.ccName} style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
									{cc.ccName}
									&nbsp;
									<ResultIcon reskey={cc.ccName} result ={cc.result} time={cc.time} error={cc.error}/>
								</div>
							}
						/>
					)
				}
			}
			connectedComponentIndex = selected.compositional.connectedComponents.findIndex(cc => cc.ccName === ccSelected);

			diagStatus = monolithic ? selected.monolithic.diagnosisStatus : selected.compositional.connectedComponents[connectedComponentIndex].diagnosisStatus;
			diagReport = monolithic ? selected.monolithic.diagnosisReport : selected.compositional.connectedComponents[connectedComponentIndex].diagnosisReport;
		}

		return (
			<div>
				<Typography variant='h6'>
					Realizability Report: {importedReport.projectName}
				</Typography>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<div style={{alignItems: 'flex-end', display: 'flex', flexWrap :'wrap'}}>
					<Grid container alignItems="flex-end">
						<FormControl className={classes.formControl}>
							<InputLabel>System Component</InputLabel>
							<Select id="qa_analysisRptCont_sel_sysComp" value={selected} onChange={this.handleChange('selected')}>
								{importedReport.systemComponents.map(sc => {
									return(
										<Tooltip key={sc.name} value={sc} title=''>
											<span key={sc.name}>
												<MenuItem key={sc.name} id={"qa_rlzCont_mi_sysComp_"+sc.name}>
													<div key={sc.name} style={{display : 'flex', alignItems : 'center'}}>
														{sc.name}
														&nbsp;
														<ResultIcon reskey={sc.name} result={monolithic ? sc.monolithic.result : sc.compositional.result}/>
													</div>
												</MenuItem>
											</span>
										</Tooltip>
									);
								})}
							</Select>
						</FormControl>
						<FormControlLabel
							disabled={selected === '' || selected.compositional.connectedComponents.length <= 1}
							control={
								<Checkbox checked={compositional} onChange={this.handleChange('compositional')} color="primary"/>
							}
							label="Compositional"
						/>
						<FormControlLabel
							disabled={selected === ''}
							control={
								<Checkbox checked={monolithic} onChange={this.handleChange('monolithic')} color="primary"/>
							}
							label="Monolithic"
							style={{marginRight: '60%'}}
						/>
						<div>
							<Button size="small" variant="contained" color="secondary" onClick={(event) =>
                this.loadNewReportInput.current.click(event)}>
								Load New Report
							</Button>
              <input
                id="qa_analysisRpt_input_newRpt"
                ref={this.loadNewReportInput}
                type="file"
                onClick={(event)=> {
                  event.target.value = null
                }}
                onChange={handleLoadClick}
                style={{ display: 'none' }}
                accept=".json"
              />
						</div>
					</Grid>
				</div>
					{selected !== '' && selected !== 'all' &&
		              <div className={classes.root}>
		                &nbsp;
		                &nbsp;
		                &nbsp;
		                <div>
		                  {selected.comments !== '' &&
		                  	<div>
	                  			<Accordion>
                    				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      				<Typography>Comments</Typography>
                    				</AccordionSummary>
                    				<AccordionDetails>
                    						<Typography variant="body2" style={{whiteSpace: 'pre-line'}}>
                    							{selected.comments}
                    						</Typography>
                    				</AccordionDetails>
                    			</Accordion>
				                  &nbsp;
				                  &nbsp;
				                  &nbsp;
				                </div>
		                	}
		                  {compositional &&
		                    <div>
		                    <AppBar position="static" color="default">
		                      <div className={classes.appbar}>
		                        <Tabs
		                          value={ccSelected}
		                          onChange={this.handleCCChange}
		                          variant="scrollable"
		                          scrollButtons="on"
		                          indicatorColor="secondary"
		                          textColor="primary"
		                          classes={{scrollable : classes.tabsScrollable}}
		                        >
		                        {tabs}
		                        </Tabs>
		                      </div>
		                    </AppBar>
		                    <TabContainer>
		                      <DiagnosisProvider>
		                        <div>
		                          {diagStatus === 'DIAGNOSED' ?
		                            (<Fade in={diagStatus === 'DIAGNOSED'}>
		                              <div>
		                                {[...Array(2)].map((e, i) => <div key={i}> &nbsp; </div>)}
		                                <ChordDiagram selectedReport = {diagReport} selectedProject=''requirements={selected.requirements}/>
		                                &nbsp;
		                              </div>
		                            </Fade>) : <div/>
		                          }
		                          <DiagnosisRequirementsTable
								  	rlzData={selected.requirements}
		                            selectedProject={selectedProject}
		                            selectedComponent={selected.name}
		                            listOfProjects={[selectedProject]}
		                            connectedComponent={selected.compositional.connectedComponents[connectedComponentIndex]}
		                            importedRequirements={true}
		                            selectedRequirements={selected.selectedReqs}
		                          />
		                        </div>
		                      </DiagnosisProvider>
		                    </TabContainer>
		                    </div>
		                  }
		                  {monolithic &&
		                    <DiagnosisProvider>
		                      <div>
		                        {diagStatus === 'DIAGNOSED' ?
		                          (<Fade in={diagStatus === 'DIAGNOSED'}>
		                            <div>
		                              {[...Array(2)].map((e, i) => <div key={i}> &nbsp; </div>)}
		                              <ChordDiagram selectedReport = {diagReport} selectedProject='' requirements = {selected.requirements}/>
		                              &nbsp;
		                            </div>
		                          </Fade>) : <div/>
		                        }
		                        <DiagnosisRequirementsTable
								  rlzData={selected.requirements}
		                          selectedProject={selectedProject}
		                          selectedComponent={selected.name}
		                          listOfProjects={[selectedProject]}
		                          connectedComponent={{}}
		                          importedRequirements={selected.requirements}
		                          selectedRequirements={selected.selectedReqs}
		                        />
		                      </div>
		                    </DiagnosisProvider>
		                  }
		                </div>
		              </div>
		            }
			</div>
		);
	}
}

AnalysisReportContent.propTypes = {
	importedReport: PropTypes.object.isRequired,
	handleLoadClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(AnalysisReportContent);
