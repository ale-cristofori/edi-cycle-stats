import React, { Component } from 'react';
import * as d3 from "d3";
import Slice from './SliceComponent';
import { func } from 'prop-types';

class Pie extends Component {

    constructor(props) {
      super(props);
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      this.renderSlice = this.renderSlice.bind(this);
    }
  
    render() {
      let {x, y, data} = this.props;
      let pie = d3.pie().sort(null)
      const counts = data.map(item => item.count);
      const pieChart = this.props.data === [] ? <div></div> : pie(counts).map(this.renderSlice);
      {/* Render a slice for each data point */}
     // accCount = this.props.data.map(item => item.)
      // https://github.com/d3/d3/wiki/Pie-Layout
      
      return (
        <g transform={`translate(${x}, ${y})`}>
        {pieChart}
          {/* Render a slice for each data point */}
          {/* {pie(data).map(this.renderSlice)} */}
        </g>
      );
    }

    renderSlice(value, i) {
    let {innerRadius, outerRadius, cornerRadius, padAngle} = this.props;
      return (
        <Slice key={i}
               onMouseOver={this.props.onArcMouseOver}
               onMouseOut={this.props.onArcMouseOut.bind(this)}
               innerRadius={innerRadius}
               outerRadius={outerRadius}
               cornerRadius={cornerRadius}
               padAngle={padAngle}
               value={value}
               year={this.props.data[i].year}
               label={`${this.props.data[i].year} - ${this.props.data[i].count}`}
               fill={this.colorScale(i)} />
      );
    }

  }

  export default Pie;