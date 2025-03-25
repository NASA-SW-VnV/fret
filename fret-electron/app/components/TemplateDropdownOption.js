// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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