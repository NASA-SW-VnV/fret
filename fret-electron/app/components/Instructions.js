// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
//
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import ReactStars from 'react-stars'
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'

import css from './Instructions.css';
import ColorPicker from './ColorPicker';
import LTLSimLauncher from './LTLSimLauncher';

import TemplatePanel from './TemplatePanel';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';

import {
  scopeInstruction,
  conditionInstruction,
  componentInstruction,
  probabilityInstruction,
  timingInstruction,
  responseInstruction
} from 'examples'
import Glossary from "./Glossary";

import { connect } from "react-redux";
import { updateFieldColors } from '../reducers/allActionsSlice';

const instructions = {
  'scopeField' : scopeInstruction,
  'conditionField' : conditionInstruction,
  'componentField' : componentInstruction,
  'probabilityField' : probabilityInstruction,
  'responseField' : responseInstruction,
  'timingField' :  timingInstruction
}

const constants = require('../parser/Constants');

const fieldsWithExplanation = ['scopeField', 'conditionField', 'componentField', 'probabilityField', 'responseField', 'timingField'];
const {ipcRenderer} = require('electron');
const ltlsim = require('ltlsim-core').ltlsim;

const styles = theme => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(),
  },
  leftIcon: {
    marginRight: theme.spacing(),
  },
  rightIcon: {
    marginLeft: theme.spacing(),
  },
  iconSmall: {
    fontSize: 12,
  },
  formula: {
    color: theme.palette.primary.main,
    fontFamily: 'Monospace',
    fontSize: 'medium'
  },
  description: {
    color: theme.palette.primary.main,
    fontFamily: 'sans-serif',
    fontSize: '14px'
  },
  buttonDescription: {
  color: theme.palette.primary.main,
  fontFamily: 'sans-serif',
  fontSize: '6px'
},
  variableDescription: {
    color: theme.palette.primary.main,
    fontFamily: 'sans-serif',
    fontSize: '14px',
    marginLeft: '7%'
  },
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    padding: '10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  formControl: {
  margin: theme.spacing(1),
  minWidth: 120,
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: '24px'}}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Instructions extends React.Component {
  constructor(props) {
    super(props);

    let status = ltlsim.check();

    /* Save to a member variable, not to the state, to have
    this independent from react updates */
    this.LTLSimStatus = status;

    this.state = {
      LTLSimDialogOpen: false,
      components: {},
      selectedItem: null,
      ptFormat: 'SMV',
      ftFormat: 'SMV',
      pctlFormat: 'PRISM',
      ftInfinite: false
    };

    this.openLTLSimDialog = this.openLTLSimDialog.bind(this);
    this.closeLTLSimDialog = this.closeLTLSimDialog.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount = () => {
    this.mounted = true
    var notationPath = `../docs/_media/user-interface/examples/svgDiagrams/Notation.svg`;
    this.setState({
      notationUrl: notationPath
    })

  }

  openDiagramNotationWindow = () => {
    window.open(this.state.notationUrl);
  }

  handleColorUpdate = async (color) => {
    const fieldKey = this.props.field.toLowerCase().replace('field','')

    // context isolation
    var argList = [fieldKey,color];
    ipcRenderer.invoke('updateFieldColors',argList).then((result) => {
      this.props.updateFieldColors({  type: 'actions/updateFieldColors',
                                      fieldColors: result.fieldColors})
    }).catch((err) => {
      console.log(err);
    })

  }

handleFormatChange = (event) => {
 this.setState({
   ptFormat: event.target.value,
 });
}

handleSwitchChange =(event) => {
  if (event.target.name === 'ftInfinite'){
   this.setState({
     ftInfinite: event.target.checked,
   })
 }
}

  openLTLSimDialog() {
    this.setState({LTLSimDialogOpen: true});
  }

  closeLTLSimDialog() {
    this.setState({LTLSimDialogOpen: false});
  }


  renderFormula() {
    const { classes, requirement, requirementID} = this.props;
    var { ft, description, diagram, type } = this.props.formalization.semantics;
    var path = `../docs/`+this.props.formalization.semantics.diagram;
    var notationPath = `../docs/_media/user-interface/examples/svgDiagrams/Notation.svg`;
    let isProbabilistic=this.props.isProbabilistic;
    if (type === 'nasa'){
      /* TODO: Currently, formalization.semantics contains HTML beautified expression
       * (i.e. including <b> and <i> tags). They are currently removed in LTLSimLauncher
       * (rewriteExpressionForLTLSIM) but this should probably be done before, such that
       * the semantics object contains both, the plain and the HTML tagged expressions.
       *
       * Currently the HTML tags are injected in SemanticsAnalyzer.replaceTemplateVarsWithArgs(),
       * which has also a parameter noHTML to prevent injection of HTML, but it is always
       * called with noHMTL = false in SemanticsAnalyzer.semantics().
       */
      var ltlsimLauncher = <LTLSimLauncher
                            open={this.state.LTLSimDialogOpen}
                            semantics={this.props.formalization.semantics}
                            status={this.LTLSimStatus}
                            onOpen={this.openLTLSimDialog}
                            onClose={this.closeLTLSimDialog}
                            requirement={requirement}
            		            project={this.props.projectName}
                            requirementID={requirementID}
                            />;
    }

    //Check if FTP appears in the formulas to display clarification message.
    var ftpInFT = this.props.formalization.semantics.ft ? this.props.formalization.semantics.ft.replace(/[()(<b>)(<i>)(</b>)(</i>)]/g,'').split(" ").includes("FTP") : false;
    var ftpInPT = this.props.formalization.semantics.pt ? this.props.formalization.semantics.pt.replace(/[()(<b>)(<i>)(</b>)(</i>)]/g,'').split(" ").includes("FTP") : false;
    if ((ft !== constants.unhandled_semantics) && (ft !== constants.nonsense_semantics)
    && (ft !== constants.undefined_semantics) && (diagram !== constants.undefined_svg))
    return(
      <div>
      {!isProbabilistic && <div>
        <br />
        <div id="qa_crtAst_sem_desc" className={classes.description} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.description}} />
        <br />
        <div className={css.imgWrap}>
        <img id="qa_crtAst_sem_img" src= {path}/>
        </div>
        <div id="qa_crtAst_sem_imgFooter" className={classes.variableDescription} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.diagramVariables}} />
        <br />
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography id="qa_crtAst_sem_typ_diagramSem" className={classes.heading}>Diagram Semantics</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className={css.notationWrap}>
        <img id="qa_crtAst_sem_img_diagramSem" src= {notationPath}/>
        </div>
        </AccordionDetails>
      </Accordion>
        <br /><br />
        </div> }
        <Typography variant='subtitle1' color='primary'>
        Formalization
        </Typography>
        <br />
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {!isProbabilistic ? <Typography id="qa_crtAst_sem_typ_futureTime" className={classes.heading}>Future Time LTL</Typography> : <Typography id="qa_crtAst_sem_typ_futureTime" className={classes.heading}>Probabilistic CTL*</Typography>}
        </AccordionSummary>
        <AccordionDetails>
          <div>
          {!isProbabilistic && <FormGroup row>
          <div>
          <FormControl>
            <Select
              labelId="select-disabled-label"
              id="qa_crtAst_sem_sel_future"
              value={this.state.ftFormat}
            >
            <MenuItem id="qa_crtAst_sem_mi_futureSmv" value='SMV' key='SMV'>SMV</MenuItem>
            </Select>
            <FormHelperText>Format</FormHelperText>
            </FormControl>
            </div>
            <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <FormControlLabel id="qa_crtAst_sem_btn_switchFutureInfinite"
                  control={<Switch size="small" checked={this.state.ftInfinite} onChange={this.handleSwitchChange} name="ftInfinite" />}
                  label="Infinite trace"/>
            </div>
            <br />
          </FormGroup>}
            {!isProbabilistic ? <div id="qa_crtAst_sem_typ_futureTimeFormula" className={classes.formula}
              dangerouslySetInnerHTML={{ __html: (this.state.ftInfinite ? this.props.formalization.semantics.ftInfAUExpanded : this.props.formalization.semantics.ftExpanded)}} />
            : <div id="qa_crtAst_sem_typ_futureTimeFormula" className={classes.formula}
              dangerouslySetInnerHTML={{ __html: (this.props.formalization.semantics.pctlExpanded)}} />}
            <br />
            <div id="qa_crtAst_sem_typ_futureTimeComp" className={classes.description} dangerouslySetInnerHTML={{ __html:' Target: '+ this.props.formalization.semantics.component + ' component.'}} />
            {ftpInFT &&
              <div className={classes.description} dangerouslySetInnerHTML={{ __html:' FTP: First Time Point.'}} />}
          </div>
        </AccordionDetails>
      </Accordion>
      {!isProbabilistic && <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography id="qa_crtAst_sem_typ_pastTime" className={classes.heading}>Past Time LTL</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div>
        <FormGroup row>
        <div>
        <FormControl>
          <Select
            labelId="format"
            id="qa_crtAst_sem_sel_past"
            value={this.state.ptFormat}
            onChange={this.handleFormatChange}
          >
            <MenuItem id="qa_crtAst_sem_mi_pastSmv" value='SMV' key='SMV'>SMV</MenuItem>
            <MenuItem id="qa_crtAst_sem_mi_pastLustre" value='Lustre' key='Lustre'>Lustre</MenuItem>
          </Select>
          <FormHelperText>Format</FormHelperText>
          </FormControl>
          </div>
          <br />
        </FormGroup>
        <br />
          <div id="qa_crtAst_sem_typ_pastTimeFormula" className={classes.formula}
          dangerouslySetInnerHTML={{ __html: (this.state.ptFormat=='SMV'
          ? (this.props.formalization.semantics.ptExpanded)
          : this.props.formalization.semantics.CoCoSpecCode)}} />
          <br />
          <div id="qa_crtAst_sem_typ_pastTimeComp" className={classes.description} dangerouslySetInnerHTML={{ __html:' Target: '+ this.props.formalization.semantics.component + ' component.'}} />
          {ftpInPT &&
              <div className={classes.description} dangerouslySetInnerHTML={{ __html:' FTP: First Time Point.'}} />}
        </div>
        </AccordionDetails>
      </Accordion>}
      <br />
      {!isProbabilistic && ltlsimLauncher}
      </div>)
      if ((ft !== constants.unhandled_semantics) && (ft !== constants.nonsense_semantics) && (ft !== constants.undefined_semantics) && (diagram === constants.undefined_svg))
      return(
        <div>
        <br />
          <div className={classes.description} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.description}} />
          <br /><br />
          <Typography variant='subtitle1' color='primary'>
          Formalizations
          </Typography>
          <br />
          <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Future Time LTL</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <div>
            <div className={classes.formula} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.ft}} />
            <br />
            <div className={classes.description} dangerouslySetInnerHTML={{ __html:' Target: '+ this.props.formalization.semantics.component + ' component.'}} />
          {ftpInFT &&
              <div className={classes.description} dangerouslySetInnerHTML={{ __html:' FTP: First Time Point.'}} />}
          </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Past Time LTL</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <div>
            <div className={classes.formula} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.pt}} />
            <br />
            <div className={classes.description} dangerouslySetInnerHTML={{ __html:' Target: '+ this.props.formalization.semantics.component + ' component.'}} />
            {ftpInPT &&
              <div className={classes.description} dangerouslySetInnerHTML={{ __html:' FTP: First Time Point.'}} />}
          </div>
          </AccordionDetails>
        </Accordion>
        <br />
        {ltlsimLauncher}
        </div>)
    else if (ft === constants.undefined_semantics && diagram !== constants.undefined_svg)
    return(
      <div>
      <br />
        <div className={classes.description} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.description}} />
        <br />
        <div className={css.imgWrap}>
        <img src= {path}/>
        </div>
        <div className={classes.variableDescription} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.diagramVariables}} />
        <br />
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Diagram Semantics</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className={css.notationWrap}>
        <img src= {notationPath}/>
        </div>
        </AccordionDetails>
      </Accordion>
      </div>)
    else if ((ft === constants.undefined_semantics)&& diagram === constants.undefined_svg)
    return(
      <div>
        <br />
        <div className={classes.description} dangerouslySetInnerHTML={{ __html: constants.undefined_description_without_diagram}} />
      </div>)
    else if (ft === constants.unhandled_semantics || ft === constants.nonsense_semantics)
    return(
      <div>
        <br />
        <div className={classes.description} dangerouslySetInnerHTML={{ __html: this.props.formalization.semantics.description}} />
      </div>)
    else
      return(
        <div>
          <br /><br />
          <Typography variant='body1' color='primary'>Not Applicable</Typography>
        </div>)
  }

  renderTemplate(templates, selectedTemplate, handleSelectedTemplateChange) {
    return(
      <div style={{display: 'block'}}>
        <TemplatePanel
        templates={templates}
        selectedTemplate={selectedTemplate}
        onChange={handleSelectedTemplateChange}/>
        </div>
    )
  }

  renderInstruction(field) {
    const { classes, fieldColors } = this.props;
    if (fieldsWithExplanation.includes(field)) {
      const mdsrc = instructions[field]
      return(
        <div id="qa_crtAst_div_explanations">
          <ReactMarkdown source={mdsrc} />
          <ColorPicker
            initialColorInHex={fieldColors[field.replace('Field', '').toLowerCase()]}
            handleColorUpdate={this.handleColorUpdate} />
        </div>
      )
    }
    else if (field === 'semantics'){
      return(
        <div id="qa_crtAst_div_semanticPanel" style={{display: 'block'}}>
          {this.renderFormula()}
        </div>
      )
    } else {
      return (
        <div>
          <div style={{paddingBottom:20}}>
            <Typography id="qa_ast_typ_speakFRETish" variant='subtitle1' color='primary'>Ready to speak FRETish?</Typography>
          </div>
          <div>
            <Typography color='primary'>Please use the editor on your left to write your requirement or pick a predefined template from the TEMPLATES tab.</Typography>
          </div>
        </div>

      )
    }
  }

  render() {
     const {field, classes, templates, selectedTemplate, handleSelectedTemplateChange, tabValue, handleTabChange} = this.props;
     return (
       <div>
         <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          centered>
          <Tab id="qa_crt_tab_assistant" label="Assistant"/>
          <Tab id="qa_crt_tab_templates" label="Templates"/>
          <Tab id="qa_crt_tab_glossary" label="Glossary"/>
        </Tabs>
        {tabValue === 0 && <TabContainer>{this.renderInstruction(field)}</TabContainer>}
        {tabValue === 1 &&
        <TabContainer>{this.renderTemplate(templates, selectedTemplate, handleSelectedTemplateChange)}</TabContainer>}
        {tabValue === 2 && <TabContainer>
          <Glossary
            id = "Glossary"
            projectName={this.props.projectName}
            setAutoFillVariables={this.props.setAutoFillVariables}
            requirements={this.props.requirements}
            editVariables={this.props.editVariables}/>
        </TabContainer>}
      </div>
    );
  }
}

Instructions.propTypes = {
  field: PropTypes.string,
  grammarRule: PropTypes.string,
  formalization: PropTypes.object,
  projectName: PropTypes.string.isRequired,
  requirement: PropTypes.string.isRequired,
  requirementID: PropTypes.string.isRequired,
  templates: PropTypes.array.isRequired,
  handleSelectedTemplateChange: PropTypes.func.isRequired,
  tabValue: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  requirements: PropTypes.array,
  setAutoFillVariables: PropTypes.func,
  editVariables: PropTypes.object,
  isProbabilistic: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const fieldColors = state.actionsSlice.fieldColors;
  return {
    fieldColors
  };
}

const mapDispatchToProps = {
  updateFieldColors,
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(Instructions));
