// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
import React from 'react'
import PropTypes from 'prop-types';
import * as d3 from 'd3'
import {getRequirementStyle} from "../utils/utilityFunctions";
import RequirementDialogs from './RequirementDialogs';

const sharedObj = require('electron').remote.getGlobal('sharedObj')
const db = sharedObj.db;
const system_dbkeys = sharedObj.system_dbkeys;
var dbChangeListener = undefined

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

  synchStateWithDB = () => {
    if (!this.mounted) return;

    db.allDocs({
      include_docs: true
    }).then( result => {
      const data = {
        name: "root",
        children: [],
      }
      const projectRootMap = {}
      const parentChildMap = {}
      const nodeMap = {}
      result.rows
      .filter(r => !system_dbkeys.includes(r.key))
      .forEach( r => {
        const req = r.doc
        var reqid = r.doc.reqid
        if (reqid == '' || reqid == undefined){ reqid = 'Undefined ReqID'}
        var project = r.doc.project
        if (project == '' || project == undefined){ project = 'Undefined ProjectID'}
        const parent_reqid = req.parent_reqid

        if (reqid && reqid.length > 0) {
          nodeMap[reqid] = {
            name: reqid,
            size: 1,
            doc: r.doc
          }
        }
        if (project && project.length > 0) {
          if (!(project in projectRootMap)) {
            projectRootMap[project] = []
          }
          if (!parent_reqid) {
            projectRootMap[project].push(reqid)
          } else if (parent_reqid && parent_reqid.length >  0){
            if (!(parent_reqid in parentChildMap)) {
              parentChildMap[parent_reqid] = []
            }
            parentChildMap[parent_reqid].push(reqid)
          }
        }
      })

      for (var parent_reqid in parentChildMap) {
        if (parent_reqid in nodeMap) {
          nodeMap[parent_reqid]['children'] = []
          parentChildMap[parent_reqid].forEach(child_reqid => {
            nodeMap[parent_reqid].children.push(nodeMap[child_reqid])
          })
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
          project_node.children.push(nodeMap[reqid])
        })

        data.children.push(project_node)
      }

      this.setState({
        graph : data
      })
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

    if (!focusGraph || !focusGraph.children || focusGraph.children.length == 0) return

    // To rerender remove previous svg
    d3.select(this.refs.anchor).selectAll("*").remove();

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
        self.setState({
          selectedRequirement: req,
          displayRequirementOpen: true
        })
      }

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) {
          return getRequirementStyle(d, true)})
        .style("fill", function(d) {return d.children ? color(d.depth) : d.data.doc.semantics ? ((d.data.doc.semantics.ft === constants.unhandled_semantics || d.data.doc.fulltext === "")  ? "white": "node node--leaf-unformalized") : "white" })
        .on("click", function(d) {
          if (focus !== d)
            zoom(d), d3.event.stopPropagation();
        })

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
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
                      + d.data.doc.semantics.ft
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
          handleRequirementDialogOpen(d.data.doc);
          if (d.data.doc) {
            d3.select(this).style("fill", null);
            tooltip
              .transition()
              .duration(0)
              .style("opacity", 0);
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
    dbChangeListener.cancel()
  }

  componentDidMount = () => {
    this.mounted = true
    dbChangeListener= db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id)) {
        this.synchStateWithDB();
      }
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });

    this.synchStateWithDB()
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.createD3()
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
          //TODO: Update
          existingProjectNames={['AllProjects']}
          displayRequirementOpen={this.state.displayRequirementOpen}
          handleDialogClose={this.handleRequirementDialogClose}
        />
      </div>
    )
  }
}

CirclePacking.propTypes = {
  selectedProject: PropTypes.string.isRequired
}
export default CirclePacking
