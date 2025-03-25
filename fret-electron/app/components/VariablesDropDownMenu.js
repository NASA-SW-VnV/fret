// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function VariablesDropdownMenu(props) {

  const {position, options, selection, onClick} = props;

  return (
    <div id = "qa_vdm_menu"
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
          id = {"qa_vdm_var_"+option}
          key={option}
          selected={i === selection}
          button
          onMouseDown={event => event.preventDefault()}
          onClick={onClick(i)}>
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </div>
  )

}

export default VariablesDropdownMenu
