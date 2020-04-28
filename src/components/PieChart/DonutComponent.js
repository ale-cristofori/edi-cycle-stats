import React, { Component } from 'react';
import * as d3 from "d3";
import Slice from './SliceComponent';

class Donut extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pieTitle: "2005 - 2017", 
          textFill: "grey",
          selectedCount: "2304",
          outerRadius : 15,
          innerRadius: 15 / 1.8,
          innerRadiusFinal3 : 15* .45,
          hoveredSlice: null
        }
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      this.renderSlice = this.renderSlice.bind(this);
      this.onClickSlice = this.onClickSlice.bind(this);
      this.onResetPieChart = this.onResetPieChart.bind(this);
    }

    onClickSlice(label, fill, value) {
        this.setState({
            pieTitle: label,
            textFill: fill,
            selectedCount: value.data
        });
        this.props.onSelectYear(label, fill);
    }

    onResetPieChart() {
      this.setState({
        pieTitle: "2005 - 2017",
        textFill: "grey",
        selectedCount: "2304"
    });
  }

    onMouseOutSlice () {
      this.setState({
        hoveredSlice: null
      })
    }

    render() {
      let {x, y, data} = this.props;
      let pie = d3.pie()
                  .sort(null);
      const counts = data.map(item => item.count);
      const textX = this.state.textFill === "grey" ? "-5em" : "-4.2em";
      const titleX = this.state.textFill === "grey" ? "5em" : "5em";
      const totalX = this.state.textFill === "grey" ? "-7.00em" : "-4.65em";
      const fontSize = this.state.textFill === "grey" ? "1.5px" : "2px";
      return (
        <g transform={`translate(${x}, ${y})`}>
          {/* Render a slice for each data point */}
          {pie(counts).map(this.renderSlice)}
        <text
            text-anchor = "middle"
            height={68}
            width={68}
            x={textX}
            y={0}
            style={{fontSize: fontSize, fontFamily: "verdana", fontWeight: "bold"}}
            fill={this.state.textFill}>
        {this.state.pieTitle && <tspan y={0} x={0} height={68} width={68}>{this.state.pieTitle}</tspan>} 
        {this.state.selectedCount && <tspan y={2} x={0}> Total: {this.state.selectedCount}</tspan>}
        </text>
        </g>
      );
    }
  
    renderSlice(value, i) {
      
      const {outerRadius, innerRadius, innerRadiusFinal, innerRadiusFinal3} = this.state;
      const finalInnerRadius = this.state.hoveredSlice === i ? innerRadiusFinal3 : innerRadius
      return (
        <Slice key={i}
               index={i}
               innerRadius={finalInnerRadius}
               outerRadius={outerRadius}
               innerRadiusFinal={innerRadiusFinal}
               innerRadiusFinal3={innerRadiusFinal3}
               value={value}
               label={this.props.data[i].year}
               fill={this.colorScale(i)} 
               onClickSlice={this.onClickSlice}
               />
      );
    }
  }

  export default Donut;