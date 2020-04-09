import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
    // state = {
    //   templateValue:'No Template',
    // };
     constructor(props) {
         super(props)
    //     this
          this.state = {
            template:'No Template'
              // anchor:null
          };
    //     //
    //     // this.handleOpenMenu = this.handleOpenMenu.bind(this);
    //     // this.handleCloseMenu = this.handleCloseMenu.bind(this);
     }

    // handleOpenMenu(event) {
    //     this.setState({anchor: event.currentTarget});
    // }
    //
    // handleCloseMenu() {
    //     this.setState({anchor:null})
    // }
    //
    handleMenuClick = index => ((event) => {
        this.props.onChange(index);
    })

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
      };

    render() {
        const {classes, templates, selected} = this.props;
        const template = templates && templates[selected]
        const patternSelected = Boolean(template);
        //const {anchor} = this.state;
        //const info = patternSelected ?
            // <TemplateInfo template={template} onClickField={this.props.onClickField}/> :
            // <NoTemplateInfo onClickPatternSelect={this.handleOpenMenu}/>;
        const title = patternSelected ? template.title+' Template' : 'No Template Selected';
        // const menuItems = templates && templates.map((template, index) => (
        //     <MenuItem
        //         key={template.title}
        //         onChange={this.handleMenuClick(index)}
        //         description={template.description}
        //     />))
        // if (menuItems != undefined)
        //   menuItems.splice(0,0,
        //     <MenuItem
        //         key={'No template'}
        //         onChange={this.handleMenuClick(-1)}
        //         description={'Create a requirement from plain FRETish without applying a predefined template.'}
        //     />)
        //     console.log
        return(
            <TextField
            id="select-template"
            select
            label="Template"
            className={classes.textField}
            value={this.state.templateValue}
            onChange={this.handleChange('templateValue')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            helperText="Please select a template"
            margin="normal"
          >
            <MenuItem
                key={'No template'} value={'No template'} onClick={this.handleMenuClick(-1)}>
                {"No template"}
            </MenuItem>
            {templates && templates.map((template, index) => (
              <MenuItem
                key={template.title} value={template.title} onClick={this.handleMenuClick(index)}
                >
                {template.title}
                </MenuItem>
            ))}
          </TextField>
          // if (this.state.templateValue != 'No Template' && templates[this.state.templateValue]){
          //   <div>
          //   <TemplateInfo template={templates[this.state.templateValue]}/>
          //   </div>
          // }
      )


    //     const menuItems = templates && templates.map((template, index) => (
    //
    //         <MenuOption
    //             key={template.title}
    //             onClick={this.handleMenuClick(index)}
    //             title={template.title}
    //             description={template.description}
    //         />))
    //     if (menuItems != undefined)
    //       menuItems.splice(0,0,
    //         <MenuOption
    //             key={'none'}
    //             onClick={this.handleMenuClick(-1)}
    //             title={'No template'}
    //             description={'Create a requirement from plain FRETish without applying a predefined template.'}
    //         />)
    //     return (
    //         <div style={{paddingBottom:10}}>
    //         <Grid container >
    //             <Grid item xs={11}>
    //                 <Typography variant='subtitle1'><b>{title}</b></Typography>
    //                 <Menu
    //                     id="templates-menu"
    //                     anchorEl={anchor}
    //                     keepMounted
    //                     open={Boolean(anchor)}
    //                     onClose={this.handleCloseMenu}
    //                     PaperProps={{
    //                       style: {
    //                         maxHeight: 200,
    //                         width: 600,
    //                       },
    //                     }}>
    //                     {menuItems}
    //                 </Menu>
    //             </Grid>
    //             <Grid item xs={1}>
    //                 <IconButton size="small" color="primary" onClick={this.handleOpenMenu}>
    //                     <ArrowDropDownIcon />
    //                 </IconButton>
    //             </Grid>
    //         </Grid>
    //         {info}
    //         </div>
    //     )
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
                <Typography>You currently have not selected predefined template. Simply specify your requirement in plain FRETish.</Typography>
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

class MenuOption extends React.Component {
    render() {
        return (
            <ListItem button onClick={this.props.onClick}>
                <div>
                <Typography >{this.props.title}</Typography>
                <Typography ><i>{this.props.description}</i></Typography>
                </div>
            </ListItem>
        )
    }
}

TemplatePanel.propTypes = {
  templates: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TemplatePanel);
