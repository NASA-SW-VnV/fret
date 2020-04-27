import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';

import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 400,
  },
});

class TemplatePanel extends React.Component {
     constructor(props) {
         super(props)
          this.state = {
            template:'No Template'
          };
     }

    handleMenuClick = index => ((event) => {
        this.props.onChange(index);
    })

    handleChange = event => {
        this.props.onChange(event.target.value)
    };

    render() {
        const {classes, templates, selectedTemplate} = this.props;
        const template = templates && templates[selectedTemplate]
        const templateSelected = Boolean(template);
        const info = templateSelected ?
            <TemplateInfo template={template}/> :
            <NoTemplateInfo/>;
        return(
          <div style={{paddingTop:'24px'}}>
            <FormControl fullWidth>
              <InputLabel id="select-template-label">Template</InputLabel>
              <Select
                id="select-template"
                value={selectedTemplate}
                onChange={this.handleChange}
                >
                <MenuItem
                  key={'key-no-template'} value={-1}>
                  No template
                </MenuItem>
                {templates && templates.map((template, index) => (
                <MenuItem key={`key-template-${index}`} value={index}>
                  {template.title}
                </MenuItem>
                ))}
              </Select>
              <FormHelperText>Choose a predefined template</FormHelperText>
            </FormControl>
            {info}
          </div>
      )
     }
}

class TemplateInfo extends React.Component {
    render() {
        const {template} = this.props;
        const patternDescription = (
          <Typography>{template.description}</Typography>
        );
        const examplesList = ( template.examples &&
          <div style={{marginTop:15}}>
            <Typography>Examples:</Typography>
            {template.examples
              .map((example, index) => {
                return <Example
                  template={template}
                  values={example}
                  index={index}
                  key={`${template.name}-example-${index}`}/>
            })}
          </div>
        )
        return (
          <div style={{marginTop:24}}>
            {patternDescription}
            {examplesList}
          </div>
        )
    }
}

class NoTemplateInfo extends React.Component {
    render() {
        return (
            <div style={{marginTop:24}}>
                <Typography>You currently have not selected predefined template.</Typography>
            </div>
        )
    }
}

class Example extends React.Component {
    render() {
        const {template, values, index} = this.props;
        const example = template.structure.reduce((result, part, partIndex) => {
            const key = `${template.name}-example-${index}-part-${partIndex}`;
            if (part.text) {
                result.push(<span key={key}>{part.text}</span>)
            } else {
                const field = part.field;
                const value = field && values[field];
                result.push(<span style={{
                                    padding: '1px 4px',
                                    margin: '1px 0px',
                                    verticalAlign: 'baseline',
                                    display: 'inline-block',
                                    border: '1px solid gray',
                                    borderRadius: '4px',
                                    backgroundColor: '#eee'}}
                                    key={key}>
                                    {' '+value+' '}
                            </span>);
            }
            return result;
        }, []);
        return (
            <div style={{marginTop:8, backgroundColor: 'white', padding:10}}>
                <Typography>
                    {example}
                </Typography>
            </div>
        )

    }
}

TemplatePanel.propTypes = {
  templates: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TemplatePanel);
