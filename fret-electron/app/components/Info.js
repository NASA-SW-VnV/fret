// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
//
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function Types() {
  return (
    <Box sx={{ width: '100%', maxWidth: 1500 }}>
      <Typography variant="h3" gutterBottom>
      FRET : Formal Requirements Elicitation Tool
      </Typography>
      <Typography variant="body1" gutterBottom>
      <strong>FRET (Formal Requirements Elicitation Tool) - Version 3</strong> is a framework for the elicitation, formalization and understanding of requirements. FRET allows its user to enter hierarchical system requirements in a structured natural language. Requirements written in this language are assigned unambiguous semantics. FRET supports its user in understanding this semantics and reformulating requirements if applicable, by utilizing a variety of forms for each requirement: natural language description, formal mathematical logics, diagrams, and interactive simulation. FRET exports requirements into forms that can be used by a variety of analysis tools, such as Cocosim, Simulink Design Verifier, Kind, JKind, SMV and PRISM, and displays/visualizes analysis results to help with diagnosis. FRET also exports test cases generated from requirements.
      </Typography>
       &nbsp;
      <Typography variant="body1" gutterBottom>
      Copyright © <strong>2025</strong>, United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
      </Typography>
       &nbsp;
      <Typography variant="body1" gutterBottom>
      The <strong>FRET (Formal Requirements Elicitation Tool) - Version 3</strong> software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this application except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
      </Typography>
       &nbsp;
      <Typography variant="body1" gutterBottom>
      Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
      </Typography>
    </Box>
  );
}
