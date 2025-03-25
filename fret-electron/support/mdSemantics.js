// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

const fretParserPath = '../app/parser/';
const FretSemantics = require(fretParserPath + 'FretSemantics');
const FetchSemantics = require(fretParserPath + 'FetchSemantics');
const generateRequirement = require(fretParserPath + 'generateRequirement');
const constants = require(fretParserPath + 'Constants');
const minimist = require('minimist');
const ProductIterable = require('product-iterable');
const fs = require('fs');
const path = require('path');
const docsPath = '../docs/';
const semanticsDocsPath = path.join(docsPath, '_media/semantics/');
const SemanticsMdFile = path.join(semanticsDocsPath, 'semantics.md');
const relativePatternsPath = 'patterns/';

const options = ['_', 'v', 'r', 'f', 'l', 'h', 'verbose', 'range', 'file', 'help', 'link'];
let args = minimist(process.argv.slice(2), {
  string: ['r', 'f'],
  boolean: ['l', 'h'], 
  default: {
    v: 0,
    r: 'llll',
    f: SemanticsMdFile,
    h: false
  },
  alias: {
    v: 'verbose',
    r: 'range', 
    f: 'file',
    l: 'link',
    h: 'help'
  },
  '--': true,
  unknown: (o) => {
    console.warn('Warning: Unknown command line option ' + o + ', will be ignored.');
  }
})

let res = args.range.match(/^[lLsS]{4}$/);
if (!res || !(res[0] === args.range)) {
  console.warn('Warning: Invalid range specified (' + args.range +  '), using \'llll\'.')
  args.range = 'llll';
  args.r = 'llll';
}

if (args.help) {
  console.log('Usage: node ./mdSemantics.js [options]\n');
  console.log('Options:');
  console.log(' -h, --help              Show this help.');
  console.log(' -r, --range   range     Set the range of the requirements fields for .md generation.');
  console.log('                         The range is a string of the form [sSlL]{4}, where');
  console.log('                           range[0] : Scope range');
  console.log('                           range[1] : Condition range');
  console.log('                           range[2] : Timing range');
  console.log('                           range[3] : Response range');
  console.log('                         \'s\' indicates that only the first possible value is considered,');
  console.log('                         and \'l\' indicates that all possible values are considered for the');
  console.log('                         respective field (Default: llll).');
  console.log(' -v, --verbose [level]   Set the verbosity level (Default: 0).');
  console.log(' -f, --file    filename  Save the output to filename');
  console.log('                         (Default: ../docs/_media/semantics/semantics.md).');
  console.log(' -l, --link              Create single .md files for each pattern and');
  console.log('                         link them from the main file (Default: false).');
  
} else {
  const fieldRanges = {
    Scope: [],
    Condition: [],
    Timing: [],
    Response: []
  };
  
  if (args.verbose) {
    console.log('Using arguments')
    console.log(' - verbose : ' + args.verbose)
    console.log(' - range   : ' + args.range)
    console.log(' - file    : ' + args.file)
    console.log(' - link    : ' + args.link)
    console.log(' - help    : ' + args.help)
  }
  
  
  let fileName = args.file;
  let fileDir = path.dirname(fileName);
  if(!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  fs.open(args.file, 'w', (err, _file) => {
    if (err) {
      console.error(err);
      return;
    } else {

      Object.keys(fieldRanges).forEach((k, i) => {
        const rangeKey = 'full' + k;
        fieldRanges[k] = (args.range[i].toLowerCase() === 'l') ? constants[rangeKey] : [constants[rangeKey][0]];
      })
      
      let product = new ProductIterable(...Object.values(fieldRanges));
      let keyIterator = product[Symbol.iterator]();
      let iterator = keyIterator.next();
      let mdHeader = header2md();
      let relativeDocsPath = (args.link) ? 
        path.relative(path.join(fileDir, relativePatternsPath), docsPath) 
        : path.relative(fileDir, docsPath);
      let mdPattern = '';
      let mdRef = '';
      let key = '';
      let href = '';

      if (args.link) {
        if(!fs.existsSync(path.join(fileDir, relativePatternsPath))) {
          fs.mkdirSync(path.join(fileDir, relativePatternsPath));
        }
      }

      fsWrite(args.file, mdHeader, args.verbose, 'Generate header');
      while (!iterator.done) {
        mdPattern = pattern2md(iterator.value, relativeDocsPath);
        key = iterator.value.toString();
        if (args.link)  {
          href = '/' + relativePatternsPath + key.replace(/,/g, '_') + '.md';
          fileName = path.join(fileDir, href);
          mdRef = patternRef2md(key, href, mdPattern.mdDescription); 
          fsWrite(fileName, mdPattern.mdString, args.verbose, 'Generate markdown for [' + key + '] pattern');
          fsAppend(fileName, mdLink('[Home]', path.join(path.relative(path.dirname(fileName), fileDir), path.basename(args.file))), args.verbose, '');
          fsAppend(args.file, mdRef, args.verbose, 'Generate link to [' + key + '] pattern');
        } else {
          fsAppend(fileName, mdPattern.mdString, args.verbose, 'Generate markdown for [' + key + '] pattern');
        }
        iterator = keyIterator.next();
      }
    }
  })
}

/**
 * Creates a markdown formated header string for the semantics documentation 
 * @return {String} The markdown formatted string   
 */
function header2md() {
  let result = mdHeader(1, 'Semantic Patterns');
  return result;
}

/**
 * Creates the markdown content for the semantic pattern
 * @param  {Array}  pattern          The semantic pattern, e.g. 
 *                                   [in,null,always,satisfaction]
 * @param  {String} relativeDocsPath The relative path from the output file 
 *                                   directory to the docs directory 
 * @return {String}                  The markdown formatted string 
 */
function pattern2md(pattern, relativeDocsPath) {
  let key = pattern.toString();
  let semantics = Object.assign({}, FetchSemantics.getSemantics({type: pattern[0]}, pattern[1], pattern[2], pattern[3]));
  let reqExample  = generateRequirement.generateRequirementFirst(pattern[0], pattern[1], pattern[2], pattern[3]);
  let reqCompiled = FretSemantics.compile(reqExample);
  let mdDescription = templateVars2md(semantics.description);
  let result = mdHeader(2, '[' + key + '] Pattern') + 
                mdImg('[' + key + '] Pattern', path.join(relativeDocsPath, semantics.diagram)) + 
                mdBulletTitled('FT Semantics', templateVars2md(semantics.ft)) + 
                mdBulletTitled('PT Semantics', templateVars2md(semantics.pt)) + 
                mdBulletTitled('Description', mdDescription) + 
                mdBlockTitled(mdItalic('Example'), mdItalic(reqExample)) + 
                ((reqCompiled.collectedSemantics.ft === constants.nonsense_semantics ||
                  reqCompiled.collectedSemantics.ft === constants.undefined_semantics) ?
                   '' : mdBlockBullet('FT Semantics', identifiers2md(rmTags(reqCompiled.collectedSemantics.ft)))) + 
                ((reqCompiled.collectedSemantics.pt === constants.nonsense_semantics ||
                  reqCompiled.collectedSemantics.pt === constants.undefined_semantics) ? 
                  '' : mdBlockBullet('PT Semantics', identifiers2md(rmTags(reqCompiled.collectedSemantics.pt)))) + 
                ((reqCompiled.collectedSemantics.description === constants.nonsense_description || 
                  reqCompiled.collectedSemantics.description === constants.undefined_description) ? 
                  '' : mdBlockBullet('Description', html2md(reqCompiled.collectedSemantics.description))) + 
                '***\n';
  return {
    mdString: result, 
    mdDescription: mdDescription
  };
}

/**
 * Creates a markdown formatted reference list entry to a semantic pattern
 * @param  {String} key         The key of the pattern, e.g. in,null,always,satisfaction
 * @param  {String} href        The link to the .md file for the pattern
 * @param  {String} description Description to be added after the link (should be markdown formatted)
 * @return {String}             The markdown formatted string
 */
function patternRef2md(key, href, description) {
  return mdBulletTitled(mdLink('[' + key + '] Pattern', '.' + href), description);
}

/**
 * Creates a markdown formatted header of the specified level, 
 * e.g. mdHeader(2, 'Header') results in ## Header
 * @param  {Number} level    The header level
 * @param  {String} content  The header content
 * @return {String}          The markdown formatted string
 */
function mdHeader(level, content) {
  let header = '';
  level = (level > 6) ? 6 : level;
  for(i=0; i<level; i++) {
    header += '#';
  }
  return header + ' ' + content + '\n';
}

/**
 * Converts the input content to markdown italics format
 * @param  {String} content  The content to appear in italics
 * @return {String}          The markdown formatted string   
 */
function mdItalic(content) {
  return '_' + content + '_';
}

/**
 * Creates a markdown link
 * @param  {String} content  The content to appear as link
 * @param  {String} href     The path to the linked file
 * @return {String}          The markdown formatted string
 */
function mdLink(content, href) {
  return '[' + content + '](' + href.replace(/\\/g, '/') + ')';
}

/**
 * Converts the input content to markdown code format
 * @param  {String} content  The content to appear as code
 * @return {String}          The markdown formatted string
 */
function mdCode(content) {
  return '`' + content + '`';
}

/**
 * Creates a markdown formatted bullet followed by a bold title and the content
 * @param  {String} title    The title to appear bold
 * @param  {String} content  The content to appear after the title       
 * @return {String}          The markdown formatted string 
 */
function mdBulletTitled(title, content) {
	return ' * **' + title + '**: ' + content + '\n';
}

/**
 * Converts the input string to a indented markdown blockquote
 * @param  {String} content  The content to appear as blockquote      
 * @return {String}          The markdown formatted string
 */
function mdBlock(content) {
  return '   > ' + content;
}

/**
 * Converts the input string to a indented markdown blockquote, where 
 * the content is preceeded by a bold title
 * @param  {String} title    The title to appear bold
 * @param  {String} content  The content to appear after the title      
 * @return {String}          The markdown formatted string  
 */
function mdBlockTitled(title, content) {
  return mdBlock('**' + title + '**: ' + content) + '   \n';
}

/**
 * Converts the input string to a indented markdown blockquote, where 
 * the content is preceeded by a bold title and appears as bullet list element
 * @param  {String} title  
 * @param  {String} content       
 * @return {String}          The markdown formatted string  
 */
function mdBlockBullet(title, content) {
  return mdBlock(mdBulletTitled(title, content));
}

/**
 * Creates a markdown image reference
 * @param  {String} title    The title to appear as alt text
 * @param  {String} img      The image link
 * @return {String}          The markdown formatted string
 */
function mdImg(title, img) {
  if (img.endsWith(constants.undefined_svg)) {
    return '_No image yet_\n';
  } 
  return '![' + title + '](' + img.replace(/\\/g, '/')  + ' \"' + title + '\")\n';
}

/**
 * converts html italic and bold elements in the input string 
 * to markdown format and removes other html tags from the input
 * @param  {String} content  The content to be formatted     
 * @return {String}          The markdown formatted string
 */
function html2md(content) {
  return rmTags(content.replace(/<\/?b>/g, '**')
                        .replace(/<\/?i>/g, '_'));
}

/**
 * Wraps all indentifiers in a formula by markdown code tags.
 * Here, identifiers can include the $ character. This is to enable the
 * formatting of strings where the template variables have not yet been
 * instanciated. 
 * @param  {String} formula  The formula to be formatted     
 * @return {String}          The markdown formatted string
 */
function identifiers2md(formula) {
  return formula.replace(/([_a-zA-Z\$][_a-zA-Z\$]+)/g, '`$1`');
}

/**
 * Wraps all template variable expressions in a formula by markdown code tags
 * @param  {String} formula  The formula to be formatted     
 * @return {String}          The markdown formatted string
 */
function templateVars2md(formula) {
  return formula.replace(/((first_in_|last_in_)?\$[_a-zA-z]\w*\$)/g, '`$1`');
}

/**
 * Removes html tags from the input string
 * @param  {String} content  The content to be formatted           
 * @return {String}          The markdown formatted string
 */
function rmTags(content) {
  return content.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Wrapper for fs.appendFile
 * @param  {String} fn        The filename
 * @param  {String} content   The content to be written to the file
 * @param  {String} verbosity The verbosity level
 * @param  {String} msg       A message to appear on the console, if verbosity != 0
 */
function fsAppend(fn, content, verbosity, msg) {
  fs.appendFile(fn, content, (err) => {
    if (err) {
      console.error(err);
      return;
    } 
  })
  if (verbosity && msg) console.log('[' + fn + '] ' + msg);
  if (verbosity > 1) console.log(content);
}

/**
 * Wrapper for fs.writeFile
 * @param  {String} fn        The filename
 * @param  {String} content   The content to be written to the file
 * @param  {String} verbosity The verbosity level
 * @param  {String} msg       A message to appear on the console, if verbosity != 0
 */
function fsWrite(fn, content, verbosity, msg) {
  fs.writeFile(fn, content, (err) => {
    if (err) {
      console.error(err);
      return;
    } 
  })
  if (verbosity && msg) console.log('[' + fn + '] ' + msg);
  if (verbosity > 1) console.log(content);
}

