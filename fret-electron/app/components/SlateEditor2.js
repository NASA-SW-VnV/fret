// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
import PropTypes from 'prop-types';
import {Editor, Node, Range, Transforms, Text} from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';
import initialValue from './slateConfigs2.json'

import React from 'react'
import { isKeyHotkey } from 'is-hotkey'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';

const FretSemantics = require('../parser/FretSemantics');
import SlateEditor2Styles from './SlateEditor2.css'
import TemplateDropdownMenu from './TemplateDropdownMenu';
import VariablesDropdownMenu from "./VariablesDropDownMenu";

const FIELDS = [
  {
    label: "Scope",
    key: "scope",
    isRequired: false,
    isDisabled: false,
  },
  {
    label: "Conditions",
    key: 'condition',
    isRequired: false,
    isDisabled: false,
  },
  {
    label: "Component",
    key: 'component',
    isRequired: true,
    isDisabled: false,
  },
  {
    label: "shall",
    key: "shall",
    isRequired: true,
    isDisabled: true,
  },
  {
    label: "Timing",
    key: "timing",
    isRequired: false,
    isDisabled: false,
  },
  {
    label: "Responses",
    key: "response",
    isRequired: true,
    isDisabled: false,
  }
]
const styles = theme => ({
  bar: {
    backgroundColor: theme.palette.secondary.main,
  },
  checked: {
    color: theme.palette.secondary.main,
  },
  paper: theme.mixins.gutters({
    paddingBottom: 16,
    height: 106,
    background: theme.palette.background.paper2,
  }),
});

const db = require('electron').remote.getGlobal('sharedObj').db;
const isDev = require('electron-is-dev');
var dbChangeListener = undefined;

/**
 * Template editor constants
 */
const fieldStartCharacter = ' ';
const fieldEndCharacter = ' ';

/**
 * Requirement Editor
 * @type {Component}
 */


class SlateEditor2 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editorValue: [],
      inputText: ' ',
      fieldColors: {},
      menuOptions: [],
      menuIndex: 0,
      selectedField: undefined,
      search: '',
      variables: [],
      beforeRange: null,
      position: null,
    }


    this.handleEditorValueChange = this.handleEditorValueChange.bind(this);
    this.handleDropdownSelection = this.handleDropdownSelection.bind(this);
    this.renderEditor = this.renderEditor.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false
    dbChangeListener.cancel()
  }

  componentDidMount() {
    this.mounted = true
    var path = `file://${process.resourcesPath}/docs/_media/rrd/index.html`
    if (isDev)
      path = `file://${__dirname}/../docs/_media/rrd/index.html`
    this.setState({
      grammarUrl: path
    })
    db.get('FRET_PROPS').then((doc) => {
      this.setState({
        fieldColors: doc.fieldColors
      })
      if (this.props.inputFields) {
        const inputFields = this.props.inputFields
        let editorValue = JSON.parse(JSON.stringify(initialValue))
        const text = inputFields.fulltext;
        const templateValues = inputFields.templateValues;
        const {template} = this.props;
        if (template && templateValues) {
          editorValue = structure2Editor(template.structure, templateValues.values);
        } else {
          editorValue[0].children[0].text = text ? text : '';
        }
        this.setContentInEditor(editorValue)
      } else {
        this.setState({
          editorValue: initialValue,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (change.id == 'FRET_PROPS') {
        const updatedValue = this.state.editorValue
        if (this.mounted) {
          this.setState({
            fieldColors: change.doc.fieldColors,
            editorValue: updatedValue
          })
        }
      }
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });

    this.props.onRef(this)
    this.setState(
      {
        handleUpdateInstruction: this.props.updateInstruction,
        handleUpdateSemantics: this.props.updateSemantics,
      }
    )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.search !== this.state.search || prevProps.autoFillVariables !== this.props.autoFillVariables) {
      const filterdVariables = this.props.autoFillVariables.filter(variable => this.state.search && variable.toLowerCase().startsWith(this.state.search.toLowerCase()))
      this.setState({ variables: filterdVariables })
    }
    if (prevState.menuOptions !== this.state.menuOptions || prevState.variables !== this.state.variables) {
      this.setState({ position: this.getPosition() })
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  componentWillReceiveProps(nextProps) {
    const oldTemplate = this.props.template;
    const newTemplate = nextProps.template;
    if ((oldTemplate && !newTemplate) ||
        (!oldTemplate && newTemplate) ||
        (oldTemplate && newTemplate &&
          oldTemplate._id !== newTemplate._id)) {
            if (newTemplate) {
              const {editorValue} = this.state;
              const values = editor2Values(editorValue);
              const slateValue = structure2Editor(newTemplate.structure, values);
              this.setContentInEditor(slateValue);
            }
          }
  }

  // Externally referenced by CreateRequirementDialog
  getRequirementFields = () => {
    return ({
      fulltext: this.getTextInEditor(),
      semantics: this.extractSemantics(),
      template: this.extractTemplateValues()
    })
  }

  /**
   * On change, save the new `editorValue`.
   *
   * @param {Change} change
   */

  setContentInEditor = (editorValue) => {
    const inputText = editor2Text(editorValue);
    const result = FretSemantics.compilePartialText(inputText)
    this.setState({
      editorValue,
      inputText,
      errors: result.parseErrors,
      semantics: result.collectedSemantics,
      menuOptions: []
    })
  }

  handleEditorValueChange = (editorValue) => {
    this.setState(prevState => {
      const inputText = editor2Text(editorValue)
      const {template} = this.props;

      let errors = prevState.errors;
      let semantics = prevState.semantics;
      if (prevState.inputText != inputText) {
        const result = FretSemantics.compilePartialText(inputText);
        errors = result.parseErrors;
        semantics = result.collectedSemantics;
      }

      /* Handle changed selection (check whether menu should be opened)
        * This needs to be done only when template fields are enabled */
      if (template) {
        const fieldNode = getFieldNode(this.props.editor);
        const fieldName = fieldNode ? fieldNode.name : undefined;
        let clonedValue = JSON.parse(JSON.stringify(editorValue));

        /* Handle cases, where the current field is populated by a placeholder.
         * In this case, the placeholder flag is removed upon selection of the
         * field in the editor */
        const newField = getField(clonedValue, fieldName);
        const newLeaf = newField && newField.children && newField.children[0];
        const newText = newLeaf && newLeaf.text;
        const oldField = getField(prevState.editorValue, fieldName);
        const oldLeaf = oldField && oldField.children && oldField.children[0];
        const oldText = oldLeaf && oldLeaf.text;
        const emptyText = fieldStartCharacter+fieldEndCharacter;
        const defaultText = fieldStartCharacter+fieldName+fieldEndCharacter;
        if (newLeaf) {
          newLeaf.isPlaceholder = !oldText ||
          (newText === emptyText) ||
          (oldLeaf.isPlaceholder && oldText === newText) ||
          (oldLeaf.isPlaceholder && oldText === emptyText && newText === defaultText);
        }

        /* The dropdown menu should only be opened when the field is empty or
         * populated with the default selection */
        const menuOptions = (fieldNode && fieldName && newLeaf && (!newText || newLeaf.isPlaceholder)) ?
                              this.getOptions(fieldName): [];
        return {  editorValue: clonedValue,
                  inputText,
                  errors,
                  semantics,
                  menuOptions,
                  menuIndex: 0,
                  selectedField: fieldName };
      } else {
        const selection = this.props.editor.selection;
        let search = '';
        let beforeRange;
        let start;
        if (selection && Range.isCollapsed(selection)) {
          [start] = Range.edges(selection);
          let before = Editor.before(this.props.editor, start, { unit: 'offset' });
          const charRange = before && Editor.range(this.props.editor, before, start)
          let char = charRange && Editor.string(this.props.editor, charRange);
          while (before && before.offset > 0 && char && char !== ' ') {
            const beforePoint = Editor.before(this.props.editor, before, { unit: 'offset'})
            const charRange =  beforePoint && Editor.range(this.props.editor, beforePoint, before);
            char = charRange && Editor.string(this.props.editor, charRange);
            before = beforePoint;
          }
          if(char === ' '){
            before = Editor.after(this.props.editor, before, { unit: 'offset' });
          }
          beforeRange = before && Editor.range(this.props.editor, before, start)
          const beforeText = beforeRange && Editor.string(this.props.editor, beforeRange)
          const beforeMatch = beforeText && beforeText.match(/^(\w+)$/);
          const after = Editor.after(this.props.editor, start)
          const afterRange = Editor.range(this.props.editor, start, after)
          const afterText = Editor.string(this.props.editor, afterRange)
          const afterMatch = afterText.match(/^(\s|$)/)
          if (beforeMatch && afterMatch) {
            search = beforeMatch[1];
          }
        }
        return {
          editorValue,
          inputText,
          errors,
          semantics,
          search,
          range: beforeRange,
        };
      }
    })
  }

  handleDropdownSelection(index) {
    const selection = this.props.editor.selection;
    const start = selection && Range.start(selection);
    const path = start && start.path;
    this.setState(prevState => {
      const { editorValue, menuOptions, menuIndex, selectedField, variables, search } = prevState;
      const selectedIndex = index ? index : menuIndex;
      if (menuOptions && menuOptions.length > 0 && selectedField) {
        Transforms.select(this.props.editor, {path, offset: 1});
        const {template} = this.props;
        const fields = template && template.fields;
        const field = fields && fields[selectedField];
        const newValue = field && field.options[selectedIndex].suggestion;
        let clonedValue = JSON.parse(JSON.stringify(editorValue));
        const newField = getField(clonedValue, selectedField);
        let newLeaf = newField && newField.children[0];
        if (newLeaf) {
          newLeaf.text = fieldStartCharacter + newValue + fieldEndCharacter;
          newLeaf.isPlaceholder = false;
        }
        const inputText = editor2Text(clonedValue);
        const result = FretSemantics.compilePartialText(inputText);

        return {
          editorValue: clonedValue,
          inputText,
          errors: result.parseErrors,
          semantics: result.collectedSemantics,
          menuIndex: 0,
          menuOptions: []
        }
      } else if (variables.length > 0) {
        const selectedIndex = index ? index : menuIndex;
        Transforms.delete(this.props.editor, {at: this.state.range})
        this.props.editor.insertText(variables[selectedIndex])
        let after = Editor.after(this.props.editor, start, { unit: 'offset' });
        const charRange = after && Editor.range(this.props.editor, start, after);
        let char = charRange && Editor.string(this.props.editor, charRange);
        while (after && char && char !== ' ') {
          const afterPoint = Editor.after(this.props.editor, after, { unit: 'offset'})
          const charRange =  afterPoint && Editor.range(this.props.editor, after, afterPoint);
          char = charRange && Editor.string(this.props.editor, charRange);
          after = afterPoint;
        }
        after = after && Editor.before(this.props.editor, after, { unit: 'offset' });
        after && Transforms.select(this.props.editor, after);
        return {
          editorValue: this.props.editor.children,
          search: '',
          menuIndex: 0,
          variables: [],
          beforeRange: null,
        }

      }
    })
  }

  handleDropdownClick = (index) => (() => this.handleDropdownSelection(index));

  handleKeyDown = (event) => {
    const selection = this.props.editor.selection;
    const isCollapsed = selection && Range.isCollapsed(selection);

    if (isKeyHotkey('mod+c', event)) {
      /* Copy hotkey. Handled by default event behavior */
    } else if (isKeyHotkey('mod+v', event)) {
      /* Paste hotkey. In this case the text from the system
       * clipboard is read and inserted to the editor. */
      event.preventDefault();
      navigator.clipboard.readText()
        .then(text => this.props.editor.insertText(text))
    } else if (isKeyHotkey('mod+x', event)) {
      /* Cut hotkey. Handled by default event behavior */
    } else if (isKeyHotkey('mod+a', event)) {
      /* Select all hotkey. Handled by default event behavior */
    } else if (isKeyHotkey('mod+z', event)) {
      /* Undo hotkey. Handled by default event behavior
       * (but not implemented by slate) */
    } else if (isKeyHotkey('mod+y', event)) {
      /* Redo hotkey. Handled by default event behavior
       * (but not implemented by slate) */
    } else if (event.key.length === 1) {
      /* Regular character. All other hotkeys have a length > 1.
       * In this case the corresponding character is simply
       * inserted. */
      event.preventDefault();
      this.props.editor.insertText(event.key)
    } else if (isKeyHotkey('space', event)) {
      /* Space character is inserted */
      event.preventDefault();
      this.props.editor.insertText(' ')
    } else if (isKeyHotkey('delete', event)) {
      /* When the selection is collapsed (i.e. the cursor is at
       * a single position instead of a range of text being
       * selected) a single character is deleted forward,
       * otherwise the entire selection is deleted. */
      event.preventDefault();
      if (isCollapsed) {
        this.props.editor.deleteForward('character');
      } else {
        this.props.editor.deleteFragment();
      }
    } else if (isKeyHotkey('backspace', event)) {
      /* When the selection is collapsed (i.e. the cursor is at
       * a single position instead of a range of text beeing
       * selected) a single character is deleted backwards,
       * otherwise the entire selection is deleted. */
      event.preventDefault();
      if (isCollapsed) {
        this.props.editor.deleteBackward('character');
      } else {
        this.props.editor.deleteFragment();
      }
    } else if (isKeyHotkey('enter', event)) {
      const {variables, menuOptions} = this.state;
      /* Enter is supressed */
      event.preventDefault();
      if(variables.length > 0 || menuOptions && menuOptions.length > 0){
        this.handleDropdownSelection();
      }
    } else if (isKeyHotkey('arrowup', event)) {
      /* Arrow up is supressed */
      event.preventDefault();
      let newIndex = -1;
      this.setState(prevState => {
        const { menuIndex, menuOptions, variables } = prevState;
        let newIndex;
        if (menuOptions && menuOptions.length > 0) {
          newIndex = menuIndex <= 0 ? menuOptions.length - 1 : menuIndex - 1;
        } else if(variables.length > 0) {
          newIndex = menuIndex <= 0 ? variables.length - 1 : menuIndex - 1;
        }
        return { menuIndex: newIndex }

      }, () => {
        if (newIndex >= 0) this.scrollToOption(newIndex)
      })
    } else if (isKeyHotkey('arrowdown', event)) {
      /* Arrow down is supressed */
      event.preventDefault();
      let newIndex = -1;
      this.setState(prevState => {
        const { menuIndex, menuOptions, variables } = prevState;
        let newIndex;
        if (menuOptions && menuOptions.length > 0) {
          newIndex = menuIndex >= menuOptions.length - 1 ? 0 : menuIndex + 1;
        } else if(variables.length > 0) {
          newIndex = menuIndex <= 0 ? variables.length - 1 : menuIndex + 1;
        }
        return { menuIndex: newIndex }
      }, () => {
        if (newIndex >= 0) this.scrollToOption(newIndex)
      })
    } else if (isKeyHotkey('arrowleft', event)) {
      /* Arrow left moves the cursor, this is working fine */
    } else if (isKeyHotkey('arrowright', event)) {
      /* Arrow right moves the cursor, this is working fine */
    } else if (isKeyHotkey('tab', event)) {
      /* Tab moves the focus to the next ui control, this is working fine */
      const {menuOptions, variables} = this.state;
      if(variables.length || menuOptions && menuOptions.length > 0){
        event.preventDefault();
        this.handleDropdownSelection(0);
        // this.setState({menuIndex: 0, menuOptions: [], variables: []})
      }
    } else if (isKeyHotkey('mod+arrowleft', event)) {
      /* Ctrl/Cmd + left moves the cursor backwards by one word */
      event.preventDefault();
      Transforms.move(this.props.editor, {distance: 1, unit: 'word', reverse: true})
    } else if (isKeyHotkey('mod+arrowright', event)) {
      /* Ctrl/Cmd + right moves the cursor forward by one word */
      event.preventDefault();
      Transforms.move(this.props.editor, {distance: 1, unit: 'word', reverse: false})
    } else if (isKeyHotkey('mod+shift+arrowleft', event)) {
      /* Ctrl/Cmd + shift + left moves the focus of the
       * current selection backwards by one word */
      event.preventDefault();
      const {anchor} = this.props.editor.selection;
      const oldAnchor = JSON.parse(JSON.stringify(anchor));
      Transforms.move(this.props.editor, { distance: 1, unit: 'word', reverse: true})
      const {focus} = this.props.editor.selection;
      Transforms.select(this.props.editor, {focus, anchor: oldAnchor});
    } else if (isKeyHotkey('mod+shift+arrowright', event)) {
      /* Ctrl/Cmd + shift + right moves the focus of the
       * current selection forward by one word */
      event.preventDefault();
      const {anchor} = this.props.editor.selection;
      const oldAnchor = JSON.parse(JSON.stringify(anchor));
      Transforms.move(this.props.editor, { distance: 1, unit: 'word', reverse: false})
      const {focus} = this.props.editor.selection;
      Transforms.select(this.props.editor, {focus, anchor: oldAnchor});
    } else {
      event.preventDefault();
    }
  }

  scrollToOption(menuIndex) {
    const domElement = document.getElementById('Option_'+menuIndex);
    domElement.scrollIntoView();
  }

  getPosition() {
    const { menuOptions, variables, search, range } = this.state;
    if (menuOptions && menuOptions.length > 0) {
      const fieldNode = getFieldNode(this.props.editor, search);
      if (fieldNode) {
        const domNode = ReactEditor.toDOMNode(this.props.editor, fieldNode);
        return [domNode.offsetTop + window.pageYOffset + 12,
                domNode.offsetLeft + window.pageXOffset];
      }
    } else if (variables.length > 0) {
      const { dialogTop, dialogLeft } = this.props;

      const domRange = ReactEditor.toDOMRange(this.props.editor, range);
      const rect = domRange.getBoundingClientRect();
      return [rect.top + window.pageYOffset - dialogTop + 12, rect.left + window.pageXOffset - dialogLeft];
    }
  }

  getOptions(currentField) {
    const { template } = this.props;
    const fields = template && template.fields;
    const field = fields && fields[currentField];
    return field ? field.options : [];
  }

  /**
   * Semantics
   *
   */

   getTextInEditor = () => {
     return editor2Text(this.state.editorValue);
   }

   enableSemantics = () => {
     const result = FretSemantics.parse(this.getTextInEditor())
     return (result.parseErrors && result.parseErrors.length > 0)
   }

   extractSemantics = () => {
     const result = FretSemantics.compile(this.getTextInEditor())
     if (result.parseErrors)
       return {}
     else if (result.collectedSemantics)
       return result.collectedSemantics
   }

   showSemantics = () => {
     const f = this.extractSemantics();
     this.setState({
       semantics: f
     })
     this.state.handleUpdateSemantics({
       semantics: f
     });
   }

  openGrammarWindow = () => {
    window.open(this.state.grammarUrl + '#' + this.props.grammarRule);
  }

  /**
   * Templates
   */
  extractTemplateValues = () => {
    const { template } = this.props;
    const { editorValue } = this.state;
    const values = editor2Values(editorValue);
    return template ? {id: template._id, values} : {};
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div>
        {this.renderSentenceStructure()}
        <br />
        {this.renderEditor()}
        <br />
        {this.renderConsole()}
      </div>
    )
  }

  renderConsole = () => {
    const {inputText, errors } = this.state
    const message = (inputText || inputText.length > 0)
                      ? ((errors) ? 'Parse Errors: ' + errors : undefined)
                      : undefined
    return (
      <div style={{width: 600, height: 100}}>
        <Typography variant='caption' color='error'>{message}</Typography>
      </div>
    )
  }

  renderSentenceStructure = () => {
    return(
      <div>
        <Typography variant='subtitle1'>Requirement Description</Typography>
        <br />
        <Typography variant='caption' gutterBottom>
          A requirement follows the sentence structure displayed below, where
          fields are optional unless indicated with "*". For information on a
          field format, click on its corresponding bubble.
        </Typography>
        <br />
        <div
          className={SlateEditor2Styles.blueprintGrid}
          style={{
            textAlign: 'center',
            padding: '10px',
          }}>
          <div className={SlateEditor2Styles.showGrammarBtn}>
          <IconButton onClick={this.openGrammarWindow} style={{padding:'2px'}}>
            <Tooltip title="See Grammar">
            <HelpIcon />
            </Tooltip>
          </IconButton>
          </div>
        {FIELDS.map(({label, key, isRequired, isDisabled}) => {
          const title = label + (isRequired ? '*' : '')
          if (isDisabled) {
            return(
              <Button
                disabled
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: this.state.fieldColors[key],
                  fontSize: '10px',
                  margin: '0px'
                }}
                key={label} >
                {title}
              </Button>
            )
          } else {
            return(
              <Button
                onClick={ () => {this.state.handleUpdateInstruction(key + 'Field')} }
                style={{
                  border: '2px solid',
                  backgroundColor: 'transparent',
                  borderColor: this.state.fieldColors[key.toLowerCase()],
                  color: this.state.fieldColors[key.toLowerCase()],
                  borderRadius: '20px',
                  fontSize: '10px',
                  cursor: 'hand',
                  margin: '2px',
                }}
                key={label} >
                {title}
              </Button>
            )
          }})}
        </div>
      </div>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  decorateNode = ([node, path]) => {
    const { inputText, semantics, editorValue } = this.state;

    // Remove leading whitespaces if there is any
    const blankOffset = inputText.length - inputText.replace(/^\s+/g, "").length

    if (!semantics) return [];

    const tokens = []
    const decorations = []

    if (node && node.type === 'paragraph') {
      Object.keys(semantics).filter(k => {
        return k.endsWith('TextRange')
      }).forEach(k => {
        const v = semantics[k]
        tokens.push({
          content: inputText.substring(v[0], v[1] + 1),
          type: k
        })

        let startOffset = v[0] + blankOffset;
        let endOffset = v[1] + 1 + blankOffset;

        if (startOffset >= 0) {
          decorations.push({
            anchor: {path, offset: startOffset},
            focus: {path, offset: endOffset},
            color: this.state.fieldColors[k.replace("TextRange", "")],
            type: k
          })
        }
      })
    }

    return decorations
  }

  renderElement(props) {
    switch(props.element.type) {
        case 'field-element':
          return (
            <span
              {...props.attributes}
              style={{
                padding: '1px 0px',
                margin: '1px 0px',
                verticalAlign: 'baseline',
                display: 'inline-block',
                border: '1px solid gray',
                borderRadius: '4px',
                backgroundColor: '#eee'}}>
              {props.children}
            </span>);
      default:
        return <p {...props.attributes}>{props.children}</p>
    }
  }

  renderLeaf = props => {
    const { attributes, children, leaf } = props
    const { fieldColors } = this.state
    let style = {};
    if (leaf.isPlaceholder) {
      style = { color: 'gray' };
    } else {
      switch (leaf.type) {
        case 'scopeTextRange':
          style = { color: fieldColors.scope };
          break
        case 'conditionTextRange':
          style = { color: fieldColors.condition };
          break
        case 'componentTextRange':
          style = { color: fieldColors.component };
          break
        case 'timingTextRange':
          style = { color: fieldColors.timing };
          break
        case 'responseTextRange':
          style = { color: fieldColors.response };
          break
      }
    }

    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    )
  }

  renderEditor = () => {
    const { template } = this.props;
    const { menuOptions, menuIndex, editorValue, variables, position } = this.state;
    const hasFields = Boolean(template);
    this.props.editor.fieldsEnabled = hasFields;

    /* Construct the editor value: When the editor is used with a pattern,
     * extract the field values from the previous editor value, apply them
     * to the template structure and convert the structure back to an editor
     * value. Otherwise, simply use the editor value from the component state.*/
    let slateValue;
    if (hasFields) {
      const values = editor2Values(editorValue);
      slateValue = structure2Editor(template.structure, values);
    } else {
      slateValue = unwrapEditorValue(editorValue);
    }

    /* Render the dropdown menu, if there are options for the current template field.
     * The current options are stored the component state and set in
     * handleEditorValueChange, based on the current cursor position
     * (selection) in the editor */
    let menu = undefined;
    if (hasFields && menuOptions && menuOptions.length > 0 && position) {
      menu = <TemplateDropdownMenu
        options={menuOptions}
        selection={menuIndex}
        position={position}
        onClick={this.handleDropdownClick}/>
    } else if (!hasFields && variables.length > 0 && position) {
      menu = <VariablesDropdownMenu
        options={variables}
        selection={menuIndex}
        position={position}
        onClick={this.handleDropdownClick}/>
    }

    return (
    <div className="editor" style={{minHeight: 150}}>
      <div style={{border: 'solid 1px gray', padding: '10px'}}>
        <Slate
          editor={this.props.editor}
          value={slateValue}
          onChange={this.handleEditorValueChange} >
          <Editable
            onKeyDown={this.handleKeyDown}
            autoFocus
            decorate={hasFields ? undefined : this.decorateNode}
            renderElement={this.renderElement}
            renderLeaf={this.renderLeaf}
            style={{minHeight: 100}}
          />
          {menu}
        </Slate>
      </div>
      <GridList cols={3} cellHeight='auto' spacing={0}>
        <GridListTile cols={2}>
        </GridListTile>
        <GridListTile>
          <div style={{textAlign:'right'}}>
            <Button onClick={this.showSemantics} size='small' color='secondary' disabled={false}>
              semantics
            </Button>
          </div>
        </GridListTile>
      </GridList>
    </div>
    )
  }
}

function editor2Text(editorValue) {
  return Node.string({children: editorValue})
}


function isMany(editor) {
  const selection = editor.selection;
  const edges = selection && Range.edges(selection);
  return edges && !isEqualPath(edges[0], edges[1]);
}

function isEqualPath(start, end) {
  if (!start || !end) return false;
  let result = true;
  let i;
  for(i = 0; i < start.path.length; i++) {
    if (start.path[i] !== end.path[i]) {
      result = false;
      break;
    }
  }
  return result;
}


function getFieldNode(editor) {
  let parent = getParent(editor);
  return (isMany(editor) ? false : parent && parent.type === 'field-element') ? parent : undefined;
}

function getField(editorValue, fieldName) {
  const paragraph = editorValue && editorValue[0];
  return paragraph && paragraph.children
    .find(child => (child.type && child.type === 'field-element' && child.name === fieldName));
}


function getParent(editor) {
  const selection = editor.selection;
  const start = selection && Range.start(selection);
  const path = start && start.path;
  let parent = undefined;
  try {
    parent = path && Node.parent(editor, path);
  } finally {
    return parent;
  }
}

function unwrapEditorValue(editorValue) {
  const editorText = editor2Text(editorValue);
  return [{
    type: 'paragraph',
    children: [{text: editorText}]
  }]
}

function structure2Editor(structure, values) {
  let editorValue = [];
  if (structure && values) {
    editorValue = [{
      type: 'paragraph',
      children: structure.map(part => part2Editor(part, values))
    }];
  } else {
    editorValue = text2Editor('');
  }
  return editorValue;
}

function part2Editor(part, values) {
  if (part.field) {
    const value = values[part.field];
    const hasValue = (value && !value.isPlaceholder && value.text && value.text.length > 0);
    const text = hasValue ? value.text : part.field;
    return {
      type: 'field-element',
      name: part.field,
      options: part.options,
      children: [{text: fieldStartCharacter+text+fieldEndCharacter, isPlaceholder: !hasValue }]}
  }
  return {text: ((part.text && part.text.length) > 0 ? part.text : ' ')};
}

function editor2Values(editorValue) {
  let paragraph = editorValue[0];
  return (paragraph && paragraph.children) ? paragraph.children
          .filter(part => (part.type && part.type === 'field-element'))
          .reduce((values, part) => {
            const leaf = part.children && part.children[0];
            const text = leaf.text;
            const isPlaceholder =  leaf.isPlaceholder;
            values[part.name] = {text: isPlaceholder ? '' : text.slice(1, text.length-1), isPlaceholder};
            return values;
          }, {}) : {};
}

SlateEditor2.propTypes = {
  classes: PropTypes.object.isRequired,
  updateInstruction: PropTypes.func.isRequired,
  updateSemantics: PropTypes.func.isRequired,
  inputFields: PropTypes.object,
  grammarRule: PropTypes.string,
  template: PropTypes.object
}
/**
 * Export.
 */

export default withStyles(styles)(SlateEditor2);
