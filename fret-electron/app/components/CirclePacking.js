// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react'
import PropTypes from 'prop-types';
import * as d3 from 'd3'
import {getRequirementStyle} from "../utils/utilityFunctions";
import RequirementDialogs from './RequirementDialogs';

const constants = require('../parser/Constants');

const COLOR_RANGE = ["hsl(0, 0%, 80%)", "hsl(0, 0%, 20%)"]

class CirclePacking extends React.Component {
  state = {
    graph : undefined,
    selectedRequirement: {},
    displayRequirementOpen: false,
  }

  handleRequirementDialogClose = () => {
    this.setState({
      displayRequirementOpen: false
    })
  }

  createGraph = () => {
    if (!this.mounted) return;
    const data = {
      name: "root",
      children: [],
    }
    const projectRootMap = {}
    const parentChildMap = {}
    const nodeMap = {}
    const mapReqIdsToProjects = {};
    this.props.requirements.forEach(r => {
      const reqid = r.doc.reqid;
      const project = r.doc.project
      if(!mapReqIdsToProjects[reqid]) {
        mapReqIdsToProjects[reqid] = [];
      }
      mapReqIdsToProjects[reqid].push(project)
    })
    this.props.requirements.forEach( r => {
      const req = r.doc
      var reqid = r.doc.reqid
      if (reqid == '' || reqid == undefined){ reqid = 'Undefined ReqID'}
      var project = r.doc.project
      if (project == '' || project == undefined){ project = 'Undefined ProjectID'}
      const parent_reqid = req.parent_reqid

      if (reqid && reqid.length > 0) {
        if(!(project in nodeMap)) {
          nodeMap[project] = {}
        }
        nodeMap[project][reqid] = {
          name: reqid,
          size: 1,
          doc: r.doc
        }
      }
      if (project && project.length > 0) {
        if (!(project in projectRootMap)) {
          projectRootMap[project] = []
        } if (parent_reqid && mapReqIdsToProjects[parent_reqid] && mapReqIdsToProjects[parent_reqid].some(proj => proj === project)){
          if(!(project in parentChildMap)) {
            parentChildMap[project] = {};
          }
          if (!(parent_reqid in parentChildMap[project])) {
            parentChildMap[project][parent_reqid] = []
          }
          parentChildMap[project][parent_reqid].push(reqid)
        } else {
          projectRootMap[project].push(reqid)
        }
      }
    })
    for (var project in parentChildMap) {
      for (var parent_reqid in parentChildMap[project]) {
        if (parent_reqid in nodeMap[project]) {
          nodeMap[project][parent_reqid]['children'] = []
          parentChildMap[project][parent_reqid].forEach(child_reqid => {
            nodeMap[project][parent_reqid].children.push(nodeMap[project][child_reqid])
          })
        }
      }
    }

    for (var project in projectRootMap) {
      const root_reqids = projectRootMap[project]
      const project_node = {
        name: project,
        size:1,
        children: []
      }
      root_reqids.forEach( reqid => {
        project_node.children.push(nodeMap[project][reqid])
      })
      data.children.push(project_node)
    }
    this.setState({
      graph : data
    })
  }

  createD3() {
    const self = this;
    const { graph } = this.state

    if (!graph) return

    const { selectedProject } = this.props

    var focusGraph = graph
    if (selectedProject != 'All Projects') {
      var filtered = graph.children.filter(p => { return p.name == selectedProject })
      focusGraph = filtered.length > 0 ? filtered[0] : []
    }

    // To rerender remove previous svg
    d3.select(this.refs.anchor).selectAll("*").remove();

    if (!focusGraph || !focusGraph.children || focusGraph.children.length == 0) return

    const width = 600
    const height = 600
    const margin = 10

    const svg = d3.select(this.refs.anchor)
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)

    const diameter = width
    const g = svg.append("g")
                 .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")

    var color = d3.scaleLinear()
        .domain([1, 7])
        .range(COLOR_RANGE)
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2);

    global = d3.hierarchy(focusGraph)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var focus = global
    var nodes = pack(global).descendants()
    var view

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function handleRequirementDialogOpen (req) {
        //req.dbkey = req._id;
        //req.rev = req._rev;
        self.setState({
          selectedRequirement: req,
          displayRequirementOpen: true
        })
      }

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("id",function(d) {
          return "qa_cirPack_circle_"+d.data.name})
        .attr("class", function(d) {
          return getRequirementStyle(d, true)})
        .style("fill", function(d) {return d.children ? color(d.depth) : d.data.doc && d.data.doc.semantics ? ((d.data.doc.semantics.ftExpanded === constants.unhandled_semantics || d.data.doc.fulltext === "")  ? "white": "node node--leaf-unformalized") : "white" })
        .on("click", function(d) {
          if (focus !== d)
            zoom(d), d3.event.stopPropagation();
        })

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("id",function(d) {
          return "qa_cirPack_text_"+d.data.name})
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === global ? 1 : 0; })
        .style("display", function(d) { return d.parent === global ? "inline" : "none"; })
        .text(function(d) { return d.data.name; })
        .on("mouseover", function(d) {
          if (d.data.doc) {
            if (d.data.doc.semantics){
            d3.select(this).style("fill", "blue");
            tooltip
              .transition()
              .duration(200)
              .style("opacity", .9);
            tooltip
              .html(
                      "<strong>"
                          + d.data.doc.reqid
                          + " ("
                          + d.data.doc.project
                          + ")</strong>"
                      + "<br/>"
                      + d.data.doc.fulltext
                      + "<br/><br/>"
                      + "<u>Formalization</u>"
                      + "<br/>"
                      + d.data.doc.semantics.ftExpanded
                    )
              .style("left", (d3.event.pageX - 25) + "px")
              .style("top", (d3.event.pageY + 25) + "px")
            }
            else {
              d3.select(this).style("fill", "blue");
              tooltip
                .transition()
                .duration(200)
                .style("opacity", .9);
              tooltip
                .html(
                        "<strong>"
                            + d.data.doc.reqid
                            + " ("
                            + d.data.doc.project
                            + ")</strong>"
                        + "<br/>"
                        + d.data.doc.fulltext
                        + "<br/><br/>"
                        + "<u>Formalization</u>"
                        + "<br/>"
                        + "undefined"
                      )
                .style("left", (d3.event.pageX - 25) + "px")
                .style("top", (d3.event.pageY + 25) + "px")
            }
        }})
        .on("mouseout", function(d) {
          if (d.data.doc) {
            d3.select(this).style("fill", null);
            tooltip
              .transition()
              .duration(100)
              .style("opacity", 0);
          }
        })
        .on("click", function(d) {
          if (d.data.doc){
            handleRequirementDialogOpen(d.data.doc);
            if (d.data.doc) {
              d3.select(this).style("fill", null);
              tooltip
                .transition()
                .duration(0)
                .style("opacity", 0);
            }
          }
        })

    var node = g.selectAll("circle,text");

    svg
        .style("background", "transparent")
        .on("click", function() { zoom(global); });

    zoomTo([global.x, global.y, global.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });

      transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
      var k = diameter / v[2]
      view = v
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function(d) { return d.r * k; });
    }

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount = () => {
    this.mounted = true;
    this.createGraph()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.createD3()
    }
    if(this.props.requirements !== prevProps.requirements) {
      this.createGraph()
    }
  }

  render() {
    this.createD3()
    return(
      <div>
        <div ref="anchor" />
        <RequirementDialogs
          selectedRequirement={this.state.selectedRequirement}
          selectedProject={this.props.selectedProject}
          listOfProjects={this.props.projects}
          displayRequirementOpen={this.state.displayRequirementOpen}
          handleDialogClose={this.handleRequirementDialogClose}
          requirements={this.props.requirements}
        />
      </div>
    )
  }
}

CirclePacking.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  requirements: PropTypes.array.isRequired
}
export default CirclePacking
