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
import {createEditor, Node, Range, Transforms, Text} from 'slate';
import {withHistory} from "slate-history";

const withFields = editorWithoutHistory => {
  const editor = withHistory(editorWithoutHistory);
  const { isInline,
    deleteBackward,
    deleteForward,
    deleteFragment,
    normalizeNode,
    insertText } = editor;

  editor.fieldsEnabled = true;

  editor.isInline = element => {
    return (element.type === 'field-element') && editor.fieldsEnabled ? true : isInline(element)
  }

  editor.normalizeNode = entry => {
    if (editor.fieldsEnabled) {
      let [node, path] = entry;
      if (node.type === 'paragraph') {
        for(const [child, childPath] of Node.children(editor, path)) {
          if (Text.isText(child) && child.text.length === 0) {
            Transforms.removeNodes(editor, {at: childPath})
          }
        }
        return
      }
    }
    normalizeNode(entry)
  }

  editor.insertText = text => {
    let cleanText = text.replace(/[\n\r\t]/g, " ");
    if (editor.fieldsEnabled) {
      if (!isMany(editor)) {
        let field = isField(editor);
        let start = Range.start(editor.selection);
        let end = Range.end(editor.selection);
        let leaf = getFirstLeaf(editor);
        if (field) {
          let textlength = leaf.text.length;
          if (start.offset >= 1 && end.offset < textlength) {
            if (leaf.isPlaceholder) {
              let anchor = {path: start.path, offset : Math.min(textlength, 1)};
              let focus = {path: end.path, offset: Math.max(textlength-1, 0)};
              Transforms.select(editor, {anchor, focus});
              editor.deleteFragment();
            }
            insertText(cleanText)
          }
        }
      }
    } else {
      insertText(cleanText)
    }
  }

  editor.insertBreak = () => {}

  editor.deleteBackward = () => {
    if (editor.fieldsEnabled) {
      if (!isMany(editor)) {
        let field = isField(editor);
        let left = getLeftSibling(editor, field);
        let start = Range.start(editor.selection);
        let leaf = getFirstLeaf(editor);
        if (start.offset === 0 && left && left.type === 'field-element') {
          return
        }
        if (field) {
          if (start.offset !== 1 && start.offset < leaf.text.length) {
            deleteBackward()
          }
        }
      }
    } else {
      deleteBackward();
    }
  }

  editor.deleteForward = () => {
    if (editor.fieldsEnabled) {
      if (!isMany(editor)) {
        let field = isField(editor);
        let right = getRightSibling(editor, field);
        let end = Range.end(editor.selection);
        let leaf = getFirstLeaf(editor);
        if (end.offset === leaf.text.length && right && right.type === 'field-element') {
          return
        }
        if (field) {
          if (end.offset !== 0 && end.offset < leaf.text.length-1) {
            deleteForward()
          }
        }
      }
    } else {
      deleteForward()
    }
  }

  editor.deleteFragment = () => {
    if (editor.fieldsEnabled) {
      if (!isMany(editor)) {
        let field = isField(editor);
        let leaf = getFirstLeaf(editor);
        let [start, end] = Range.edges(editor.selection);
        if (field) {
          let textlength = leaf.text.length;
          let anchor = {path: start.path, offset : (start.offset > 0) ? start.offset : Math.min(textlength, 1)};
          let focus = {path: end.path, offset: (end.offset < textlength) ? end.offset : Math.max(textlength-1, 0)};
          Transforms.select(editor, {anchor, focus});
          deleteFragment()
        }
      }
    } else {
      deleteFragment();
    }
  }
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

function isField(editor) {
  let parent = getParent(editor);
  return isMany(editor) ? false : parent && parent.type === 'field-element';
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

function getFirstLeaf(editor) {
  const selection = editor.selection;
  const start = selection && Range.start(selection);
  const path = start && start.path;
  return path && Node.leaf(editor, path);
}

function getLeftSibling(editor, oneUp) {
  let path = [...Range.start(editor.selection).path];
  if (oneUp) {
    path.pop()
  }
  if (path[path.length-1] > 0) {
    path[path.length-1] = path[path.length-1] - 1;
    return Node.get(editor, path)
  }
  return null
}

function getRightSibling(editor, oneUp) {
  let path = [...Range.start(editor.selection).path];
  if (oneUp) {
    path.pop()
  }
  let parent = Node.parent(editor, path);
  if (path[path.length-1] < parent.children.length-1) {
    path[path.length-1] = path[path.length-1] + 1;
    return Node.get(editor, path)
  }
  return null
}

export default withFields;
