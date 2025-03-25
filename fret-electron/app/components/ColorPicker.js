// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react'
import reactCSS from 'reactcss'
import { CompactPicker } from 'react-color'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

var hexToRgba = require("hex-to-rgba");

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: {}
  };

  componentDidMount() {
    this.setState({
      color: {
        hex: this.props.initialColorInHex
      },
      handleColorUpdate: this.props.handleColorUpdate
    })
  }
  componentWillReceiveProps(props, nextState) {
    this.setState({
      color: {
        hex: props.initialColorInHex
      }
    })
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    this.state.handleColorUpdate(this.state.color)
  };

  handleChange = (color) => {
    this.setState({ color: color })
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color.hex,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
          verticalAlign: 'middle',
          marginLeft:'10px'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={{display:'inline-block'}}>
          <span style={{verticalAlign:'middle', fontSize:'14px'}}>
            Bubble Color :
          </span>
          <div style={ styles.swatch } onClick={ this.handleClick }>
            <div style={ styles.color } id="qa_crtAst_div_assistantColorPicker"/>
          </div>
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <CompactPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }
      </div>
    )
  }
}

ColorPicker.propTypes = {
  initialColorInHex: PropTypes.string.isRequired, // format: hex
  handleColorUpdate: PropTypes.func.isRequired
}

export default ColorPicker
