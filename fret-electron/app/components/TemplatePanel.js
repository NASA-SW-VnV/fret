import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';

class TemplatePanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            anchor:null
        };

        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    handleOpenMenu(event) {
        this.setState({anchor: event.currentTarget});
    }

    handleCloseMenu() {
        this.setState({anchor:null})
    }

    handleMenuClick = index => ((event) => {
        this.setState({anchor:null}, () => {this.props.onChange(index);})
    })

    render() {
        const {templates, selected} = this.props;

        const template = templates && templates[selected]
        const patternSelected = Boolean(template);
        const {anchor} = this.state;
        const info = patternSelected ?
            <TemplateInfo template={template} onClickField={this.props.onClickField}/> :
            <NoTemplateInfo onClickPatternSelect={this.handleOpenMenu}/>;
        const title = patternSelected ? template.title+' Template' : 'No Template Selected';
        const menuItems = templates && templates.map((template, index) => (
            <MenuOption
                key={template.title}
                onClick={this.handleMenuClick(index)}
                title={template.title}
                description={template.description}
            />))
        if (menuItems != undefined)
          menuItems.splice(0,0,
            <MenuOption
                key={'none'}
                onClick={this.handleMenuClick(-1)}
                title={'No template'}
                description={'Create a requirement from plain FRETish without applying a predfined template.'}
            />)
        return (
            <div style={{paddingBottom:20}}>
            <Grid container >
                <Grid item xs={11}>
                    <Typography variant='subtitle1'><b>{title}</b></Typography>
                    <Menu
                        id="templates-menu"
                        anchorEl={anchor}
                        keepMounted
                        open={Boolean(anchor)}
                        onClose={this.handleCloseMenu}
                        PaperProps={{
                          style: {
                            maxHeight: 200,
                            width: 600,
                          },
                        }}>
                        {menuItems}
                    </Menu>
                </Grid>
                <Grid item xs={1}>
                    <IconButton size="small" color="primary" onClick={this.handleOpenMenu}>
                        <ArrowDropDownIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {info}
            </div>
        )
    }
}

class TemplateInfo extends Component {
    render() {
        const {template} = this.props;
        const patternDescription = (
            <Typography variant='body1'>{template.description}</Typography>
        );
        const examplesList = ( template.examples &&
            <div style={{marginTop:24}}>
                <Typography variant='body1'>Examples:</Typography>
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

class NoTemplateInfo extends Component {
    render() {
        return (
            <div style={{marginTop:24}}>
                <Typography variant='body1'>You currently have not selected predefined template. Simply specify your requirement in plain FRETish.</Typography>
                <div style={{marginTop:40}}>
                    <div style={{marginTop:16}}>
                        <Button color='primary' onClick={this.props.onClickPatternSelect}>Select a template</Button>
                    </div>
                    <div style={{marginTop:16}}>
                        <Button color='primary'>Create a template from this requirement</Button>
                    </div>
                </div>
            </div>
        )
    }
}

class Example extends Component {
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
            <div style={{marginTop:8}}>
                <Typography variant='body2'>
                    {example}
                </Typography>
            </div>
        )

    }
}

class MenuOption extends Component {
    render() {
        return (
            <ListItem button onClick={this.props.onClick}>
                <div>
                <Typography variant='body1'>{this.props.title}</Typography>
                <Typography variant='body2' ><i>{this.props.description}</i></Typography>
                </div>
            </ListItem>
        )
    }
}

TemplatePanel.propTypes = {
  templates: PropTypes.array.isRequired,
}

export default TemplatePanel;
