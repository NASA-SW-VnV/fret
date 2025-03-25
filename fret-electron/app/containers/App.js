// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
import * as React from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import secondaryColor from '@material-ui/core/colors/cyan';
import primaryColor from '@material-ui/core/colors/blueGrey';


type Props = {
  children: React.Node
};

const theme = createTheme({
  palette: {
    primary: { main: primaryColor[800] },
    secondary: { main: secondaryColor['400'] },
    background: {
      paper2: secondaryColor['50']
    },
    type: 'light'
  },
  typography: {
    useNextVariants: true,
  }});


export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <div>
        {this.props.children}
      </div>
      </MuiThemeProvider>
    );
  }
}
