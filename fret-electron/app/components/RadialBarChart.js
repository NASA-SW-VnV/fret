// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
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
