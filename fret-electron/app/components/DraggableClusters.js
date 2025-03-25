// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
import React from 'react';
import * as d3 from 'd3';
import * as d3annotation from 'd3-svg-annotation';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import './DraggableClusters.css';
const constants = require('../parser/Constants');

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: 600,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  },
});

var simulation;
class DraggableClusters extends React.Component {
  state = {
    graph : undefined,
    groups : [],
    title : "Traceability and Clustering"
  }

  createGraph() {
    if (!this.mounted) return;
      var graph = {
            "nodes" : [],
            "links" : []
          }

      var groups = []
      var allReqIds = []
      this.props.requirements.forEach((r) => {
        const project = r.doc.project
        if (project && project.length > 0) {
          var reqid = r.doc.reqid
          allReqIds.push(reqid)
          var parent_reqid = r.doc.parent_reqid
          var isFormalized = r.doc.ltl || r.doc.semantics && (r.doc.semantics.ft && r.doc.semantics.ft !== constants.nonsense_semantics && r.doc.semantics.ft !== constants.undefined_semantics && r.doc.semantics.ft !== constants.unhandled_semantics)
          var group = project
          if (groups.indexOf(group) < 0) groups.push(group)
          graph["nodes"].push({
            "id" : reqid,
            "isFormalized" : (isFormalized) | 0,
            "group" : group
          })
          if (parent_reqid) {
            graph["links"].push({
              "source" : parent_reqid,
              "target" : reqid,
              "value" : 1
            })
          }
        }
      });
      // Remove links to missing nodes
      graph.links.forEach((e, i) => {
        if (allReqIds.indexOf(e.source) < 0)
          graph.links.splice(i, 1)
      })
      this.setState({
        graph : graph,
        groups : groups
      })
  }

  createD3(graph, groups) {
    if (!graph || graph.nodes.length == 0) return;

    // To rerender remove previous svg
    d3.select(this.refs.anchor).selectAll("*").remove();

    // D3 code
    var width = 850, height = 850;

    const svg = d3.select(this.refs.anchor)
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    const color = {
      0: '#EF5350',
      1: '#9CCC65',
    };

    const circlePadding = 10;

    simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
        .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', d => color[`${d.isFormalized}`] || 'lightgrey')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    node.append('title')
      .text(d => d.id);

    d3.select('body')
      .on('touchstart', noZoom)
      .on('touchmove', noZoom)

    simulation
      .nodes(graph.nodes)
      .on('tick', ticked)

    simulation.force('link')
      .links(graph.links);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      var annotations = d3.window.makeAnnotations.annotations()
      annotations.forEach((d, i) => {
        points = graph.nodes
          .filter(d => d.group === groups[i])
          .map(d => ({
            x: d.x,
            y: d.y,
            r: 5
          }));
        if (points.length > 0) {
          circle = d3.packEnclose(points);
          d.position = {
            x: circle.x,
            y: circle.y
          };
          d.subject.radius = circle.r + circlePadding;
        }
      });
      d3.window.makeAnnotations.update();
    }

    // Remove empty groups
    let points = groups.map(p => graph.nodes
    .filter(d => d.group === p)
    .map(d => ({
      x: d.x,
      y: d.y,
      r: 5
    })));

    let circle = points.map(p => d3.packEnclose(p));

    const annotations = []
    groups.forEach((g, i) => {
      if (circle[i]) {
        annotations.push({
          note: {
            label: 'Requirements',
            title: g
          },
          dy: 75,
          dx: (i % 2 == 0) ? 100 : -100,
          x: circle[i].x,
          y: circle[i].y,
          type: d3annotation.annotationCalloutCircle,
          subject: {
            radius: circle[i].r,
            radiusPadding: 10,
          }
        })
      }
    })

    d3.window.makeAnnotations = d3annotation.annotation()
      .annotations(annotations)
      .accessors({ x: d => d.x, y: d => d.y });

    svg.append('g')
      .attr('class', 'annotation-encircle')
      .call(d3.window.makeAnnotations);

    svg.selectAll('.annotation-subject')
      .style('pointer-events', 'none');
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.createGraph();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.requirements !== prevProps.requirements ) {
      this.createGraph()
    }
  }

  render() {
    const { classes } = this.props;
    const { graph, groups } = this.state;
    this.createD3(graph, groups)
    return (
      <div>
        <div ref="anchor"/>
      </div>
    );
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function noZoom() {
  d3.event.preventDefault();
}

export default withStyles(styles)(DraggableClusters);
