import React from 'react';
import Typography from '@material-ui/core/Typography';

function TemplateDropdownOption(props) {
  const {option} = props;
  return (
      <div
        style={{
          padding: '0px',
          borderRadius: '0px',
          background: 'transparent'
        }}>
        <Typography variant='body1' style={{overflowWrap: 'anywhere'}}>{option.suggestion}</Typography>
        <Typography variant='body2' ><i>{option.description}</i></Typography>
    </div>
    )
}

export default TemplateDropdownOption