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
import { createEditor, Node, Range, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import initialValue from './slateConfigs2.json'

import React from 'react'
import { isKeyHotkey } from 'is-hotkey'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';

const FretSemantics = require('../parser/FretSemantics');
import SlateEditor2Styles from './SlateEditor2.css'

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
 * Requirment Editor
 * @type {Component}
 */

class SlateEditor2 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: initialValue,
      inputText: ' ',
      fieldColors: {}
    }  

    this.editor = withFields(withReact(createEditor()));

    this.handleEditorValueChange = this.handleEditorValueChange.bind(this);
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
        let clonedValue = JSON.parse(JSON.stringify(initialValue))
        const text = inputFields.fulltext;
        clonedValue[0].children[0].text = text ? text : 'Some initial text, just for testing!';
        this.setContentInEditor(clonedValue)
      } else {
        this.setState({
          value: initialValue,
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
        const updatedValue = this.state.value
        if (this.mounted) {
          this.setState({
            fieldColors: change.doc.fieldColors,
            value: updatedValue
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
  
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  // Externally referenced by CreateRequirementDialog
  getRequirementFields = () => {
    return ({
      fulltext: this.getTextInEditor(),
      semantics: this.extractSemantics(),
    })
  }


  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  setContentInEditor = (value) => {
    const inputText = editor2Text(value);
    const result = FretSemantics.compilePartialText(inputText)
    this.setState({
      value,
      inputText,
      errors: result.parseErrors,
      semantics: result.collectedSemantics
    })
  }

  handleEditorValueChange = (value) => {
    const editorText = editor2Text(value)
    if (this.state.inputText != editorText) {
      this.setContentInEditor(value)
    }
    this.setState({
      value,
    })
  }

  handleKeyDown = (event) => {
    const selection = this.editor.selection;
    const isCollapsed = selection && Range.isCollapsed(selection);
 
    if (event.key.length === 1) {
      /* Regular character. All hotkeys have a length > 1. 
       * In this case the corresponding character is simply
       * inserted. */
      event.preventDefault();
      this.editor.insertText(event.key)
    } else if (isKeyHotkey('space', event)) {
      /* Space character is inserted */
      event.preventDefault();
      this.editor.insertText(' ')
    } else if (isKeyHotkey('delete', event)) {
      /* When the selection is collapsed (i.e. the cursor is at 
       * a single position instead of a range of text beeing 
       * selected) a single character is deleted forward, 
       * otherwise the entire selection is deleted. */
      event.preventDefault();
      if (isCollapsed) {
        this.editor.deleteForward('character');
      } else {
        this.editor.deleteFragment();
      }
    } else if (isKeyHotkey('backspace', event)) {
      /* When the selection is collapsed (i.e. the cursor is at 
       * a single position instead of a range of text beeing 
       * selected) a single character is deleted backwards, 
       * otherwise the entire selection is deleted. */
      event.preventDefault();
      if (isCollapsed) {
        this.editor.deleteBackward('character');
      } else {
        this.editor.deleteFragment();
      }
    } else if (isKeyHotkey('enter', event)) {
      /* Enter is supressed */
      event.preventDefault();
    } else if (isKeyHotkey('arrowup', event)) {
      /* Arrow up is supressed */
      event.preventDefault();
    } else if (isKeyHotkey('arrowdown', event)) {
      /* Arrow down is supressed */
      event.preventDefault();
    } else if (isKeyHotkey('arrowleft', event)) {
      /* Arrow left moves the cursor, this is working fine */
    } else if (isKeyHotkey('arrowright', event)) {
      /* Arrow right moves the cursor, this is working fine */
    } else if (isKeyHotkey('tab', event)) {
      /* Tab moves the focus to the next ui control, this is working fine */
    } else if (isKeyHotkey('mod+arrowleft', event)) {
      /* Ctrl/Cmd + left moves the cursor backwards by one word */
      event.preventDefault();
      Transforms.move(this.editor, {distance: 1, unit: 'word', reverse: true})
    } else if (isKeyHotkey('mod+arrowright', event)) {
      /* Ctrl/Cmd + right moves the cursor forward by one word */
      event.preventDefault();
      Transforms.move(this.editor, {distance: 1, unit: 'word', reverse: false})
    } else if (isKeyHotkey('mod+shift+arrowleft', event)) {
      /* Ctrl/Cmd + shift + left moves the focus of the 
       * current selection backwards by one word */
      event.preventDefault();
      const {anchor} = this.editor.selection;
      const oldAnchor = JSON.parse(JSON.stringify(anchor));
      Transforms.move(this.editor, { distance: 1, unit: 'word', reverse: true})
      const {focus} = this.editor.selection;
      Transforms.select(this.editor, {focus, anchor: oldAnchor});
    } else if (isKeyHotkey('mod+shift+arrowright', event)) {
      /* Ctrl/Cmd + shift + right moves the focus of the 
       * current selection forward by one word */
      event.preventDefault();
      const {anchor} = this.editor.selection;
      const oldAnchor = JSON.parse(JSON.stringify(anchor));
      Transforms.move(this.editor, { distance: 1, unit: 'word', reverse: false})
      const {focus} = this.editor.selection;
      Transforms.select(this.editor, {focus, anchor: oldAnchor});
    } else {
      event.preventDefault();
    }
  }

  /**
   * Semantics
   *
   */

   getTextInEditor = () => {
     return editor2Text(this.state.value);
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
                      ? ((this.state.errors) ? 'Parse Errors: ' + this.state.errors : undefined)
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
          <IconButton onClick={this.openGrammarWindow}>
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

  decorateNode = node => {
    const { inputText, semantics } = this.state

    // Remove leading whitespaces if there is any
    const blankOffset = inputText.length - inputText.replace(/^\s+/g, "").length

    if (!semantics) return null

    const texts = node.getTexts().toArray()
    const tokens = []

    Object.keys(semantics).filter(k => {
      return k.endsWith('TextRange')
    }).forEach(k => {
      const v = semantics[k]
      tokens.push({
        content: inputText.substring(v[0], v[1] + 1),
        type: k
      })
    })
    const decorations = []
    texts.forEach((textNode) => {
      // Find tokens in texts
      const text = textNode.text
      tokens.forEach((token) => {
        let startOffset = text.indexOf(token.content) + blankOffset
        if (startOffset >= 0) {
          const range = {
            anchorKey: textNode.key,
            anchorOffset: startOffset,
            focusKey: textNode.key,
            focusOffset: startOffset + token.content.length,
            marks: [
              {
                type: token.type,
                color: this.state.fieldColors[token.type.replace("TextRange", "")]
              }],
          }
          decorations.push(range)
        }
      })
    })
    return decorations
  }

  renderMark = props => {
    const { children, mark, attributes } = props
    const { fieldColors } = this.state
    switch (mark.type) {
      case 'scopeTextRange':
        return (
          <span {...attributes} style={{ color: fieldColors.scope }}>
            {children}
          </span>
        )
      case 'conditionTextRange':
        return (
          <span {...attributes} style={{ color: fieldColors.condition }}>
            {children}
          </span>
        )
      case 'componentTextRange':
        return (
          <span {...attributes} style={{ color: fieldColors.component }}>
            {children}
          </span>
        )
      case 'timingTextRange':
        return (
          <span {...attributes} style={{ color: fieldColors.timing }}>
            {children}
          </span>
        )
      case 'responseTextRange':
        return (
          <span {...attributes} style={{ color: fieldColors.response }}>
            {children}
          </span>
        )
    }
  }

  renderEditor = () => {
    const { classes } = this.props;

    return (
    <div className="editor" style={{width: 750, height: 150}}>
      <div style={{border: 'solid 1px gray', padding: '10px', height: 100}}>
        <Slate 
          editor={this.editor} 
          value={this.state.value}
          onChange={this.handleEditorValueChange}>
          <Editable 
            onKeyDown={this.handleKeyDown}/>
        </Slate>
      </div>
      <GridList cols={3} cellHeight='auto' spacing={0}>
        <GridListTile cols={2}>
        </GridListTile>
        <GridListTile>
          <div style={{textAlign:'right'}}>
            <Button onClick={this.showSemantics} size='small' color='secondary' disabled={this.enableSemantics()}>
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

const withFields = editor => {
  const { isInline, 
          deleteBackward, 
          deleteForward, 
          deleteFragment, 
          normalizeNode, 
          insertText } = editor;

  editor.instantiate = true;
  editor.fieldsEnabled = true;
  // editor.onChange = (value) => {console.log(value)};

  editor.isInline = element => {
    return (element.type === 'field-element') && editor.fieldsEnabled ? true : isInline(element)
  }

  // editor.insertText = text => {
  //   console.log(`Insert ${text} ...`)
  //   insertText(text);
  // }

  // editor.normalizeNode = entry => {
  //   if (editor.fieldsEnabled) {
  //     let [node, path] = entry;
  //     if (node.type === 'paragraph') {
  //       for(const [child, childPath] of Node.children(editor, path)) {
  //         if (Text.isText(child) && child.text.length === 0) {
  //           Transforms.removeNodes(editor, {at: childPath})
  //         }
  //       }
  //       return
  //     }
  //   }
  //   normalizeNode(entry)
  // }

  // editor.insertText = text => {
  //   if (editor.fieldsEnabled) {
  //     if (!isMany(editor)) {
  //       let field = isField(editor);
  //       let start = Range.start(editor.selection);
  //       let end = Range.end(editor.selection);
  //       let leaf = getFirstLeaf(editor);
  //       if (field) {
  //         if (start.offset >= 1 && end.offset < leaf.text.length) {
  //           insertText(text)
  //         }
  //       } else if (!editor.instantiate) {
  //         insertText(text)
  //       }
  //     }
  //   } else {
  //     insertText(text)
  //   }
  // }

  editor.insertBreak = () => {}

  // editor.deleteBackward = () => {
  //   if (editor.fieldsEnabled) {
  //     if (!isMany(editor)) {
  //       let field = isField(editor);
  //       let left = getLeftSibling(editor, field);
  //       let start = Range.start(editor.selection);
  //       let leaf = getFirstLeaf(editor);
  //       if (start.offset === 0 && left && left.type === 'field-element') {
  //         return
  //       }
  //       if (field) {
  //         if (start.offset !== 1 && start.offset < leaf.text.length) {
  //           deleteBackward()
  //         }
  //       } else if (!editor.instantiate) {
  //         deleteBackward()
  //       }
  //     }
  //   } else {
  //     deleteBackward();
  //   }
  // }

  // editor.deleteForward = () => {
  //   if (editor.fieldsEnabled) {
  //     if (!isMany(editor)) {
  //       let field = isField(editor);
  //       let right = getRightSibling(editor, field);
  //       let end = Range.end(editor.selection);
  //       let leaf = getFirstLeaf(editor);
  //       if (end.offset === leaf.text.length && right && right.type === 'field-element') {
  //         return
  //       }
  //       if (field) {
  //         if (end.offset !== 0 && end.offset < leaf.text.length-1) {
  //           deleteForward()
  //         } 
  //       } else if (!editor.instantiate) {
  //         deleteForward()
  //       }
  //     }
  //   } else {
  //     deleteForward()
  //   }
  // }

  // editor.deleteFragment = () => {  
  //   if (editor.fieldsEnabled) {
  //     if (!isMany(editor)) {
  //       let field = isField(editor);
  //       let start = Range.start(editor.selection);
  //       let end = Range.end(editor.selection);
  //       let leaf = getFirstLeaf(editor);
  //       if (field && start.offset !== 0 && end.offset < leaf.text.length) {
  //         deleteFragment()
  //       } else if (!editor.instantiate) {
  //         deleteFragment()
  //       }
  //     } 
  //   } else {
  //     deleteFragment();
  //   }
  // } 
  return editor;
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

SlateEditor2.propTypes = {
  classes: PropTypes.object.isRequired,
  updateInstruction: PropTypes.func.isRequired,
  updateSemantics: PropTypes.func.isRequired,
  inputFields: PropTypes.object,
  grammarRule: PropTypes.string,
}
/**
 * Export.
 */

export default withStyles(styles)(SlateEditor2);
