// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import {RadialBarChart, RadialBar, Legend} from 'recharts';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { schemeCategory20c as colors} from 'd3-scale';

import css from './RadialBarChart.css';
const constants = require('../parser/Constants');
var dbChangeListener = undefined;

const style = {
	top: 0,
	left: 300,
	lineHeight: '24px'
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '300px',
  },
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  },
});

class SimpleRadialBarChart extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      total : 0,
      formalized : 0
    }
  }

  synchStateWithDB() {
    if (!this.mounted) return;

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      var total = result.rows.length
      var formalizedCt = 0
      result.rows.forEach((r) => {
          if (r.doc.ltl || (r.doc.semantics.ft && r.doc.semantics.ft !== constants.nonsense_semantics && r.doc.semantics.ft !== constants.undefined_semantics && r.doc.semantics.ft !== constants.unhandled_semantics)) formalizedCt++
      })
      this.setState({
        total : total,
        formalized : formalizedCt

      })
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithDB()

    dbChangeListener = db.changes({
			since: 'now',
			live: true,
			include_docs: true
		}).on('change', (change) => {
			if (change.id != 'FRET_PROPS') {
				console.log(change);
      	this.synchStateWithDB();
			}
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });

  }

  componentWillUnmount() {
    this.mounted = false;
		dbChangeListener.cancel()
  }

	render () {
    const { classes } = this.props;
    const { total, formalized } = this.state;

    var data = [
          {name: total + ' Requirements', uv: total, fill: colors[8]},
          {name: formalized + '  Formalized', uv: formalized, fill: colors[9]},
        ];

    var outerRadius = 100;
    var innerRadius = 100 - data.length * 20
  	return (
      <div className={css.container}>
      <Typography variant="h6" color="primary"className={classes.title}>
        Distribution
      </Typography>
    	<RadialBarChart width={200} height={200} cx={100} cy={100} innerRadius={innerRadius} outerRadius={outerRadius} barSize={10} data={data}>
        <RadialBar minAngle={15} background clockWise={true} dataKey='uv'/>
        <Legend iconSize={10} width={220} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
      </RadialBarChart>
      </div>
    );
  }
}

export default withStyles(styles)(SimpleRadialBarChart);
