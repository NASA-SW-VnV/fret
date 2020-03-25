import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import TemplateDropdownOption from './TemplateDropdownOption';

function TemplateDropdownMenu(props) {

    const {position, options, selection, onClick} = props;

    return (
        <div
            style={{
            top: `${position ? position[0] : -9999}px`,
            left: `${position ? position[1] : -9999}px`,
            maxWidth: '425px',
            maxHeight: '200px',
            overflowY: 'auto',
            position: 'absolute',
            zIndex: 1,
            padding: '3px',
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 5px rgba(0,0,0,.2)',
        }}>
            {options.map((option, i) => (
            <ListItem 
                key={'Option_'+i} 
                selected={i === selection} 
                id={'Option_'+i}
                button
                onClick={onClick}>
                <TemplateDropdownOption option={option} selected={i === selection}/>
            </ListItem>
            ))}
        </div>
    )

}

export default TemplateDropdownMenu