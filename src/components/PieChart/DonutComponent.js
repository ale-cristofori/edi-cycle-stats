import React, { Component } from 'react';
import * as d3 from "d3";
import Slice from './SliceComponent';

class Donut extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pieTitle: "", 
          textFill: "",
          selectedCount: "",
          outerRadius : 15,
          innerRadius: 15 / 1.8,
          innerRadiusFinal3 : 15* .45,
          hoveredSlice: null
        }
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      this.renderSlice = this.renderSlice.bind(this);
      this.onClickSlice = this.onClickSlice.bind(this);
      this.onMouseOverSlice = this.onMouseOverSlice.bind(this);
      this.onMouseOutSlice = this.onMouseOutSlice.bind(this);
    }

    onClickSlice(label, fill, value) {
        this.setState({
            pieTitle: label,
            textFill: fill,
            selectedCount: value.data
        });
        this.props.onSelectYear(label);
    }

    onMouseOverSlice (value) {
      this.setState({
        hoveredSlice: value.index
      })
    }

    onMouseOutSlice () {
      this.setState({
        hoveredSlice: null
      })
    }

    componentDidUpdate() {

    }

    render() {
      let {x, y, data} = this.props;
      // https://github.com/d3/d3/wiki/Pie-Layout
      let pie = d3.pie()
                  .sort(null);
      const counts = data.map(item => item.count);
      return (
        <g transform={`translate(${x}, ${y})`}>
          {/* Render a slice for each data point */}
          {pie(counts).map(this.renderSlice)}
        <text
            x="-4.2em"
            y="-.35em"
            textAnchor="middle"
            style={{fontSize: "2px", fontFamily: "verdana", fontWeight: "bold"}}
            fill={this.state.textFill}>
        {this.state.pieTitle && <tspan dy="0em" dx="5em">{this.state.pieTitle}</tspan>}
        {this.state.selectedCount && <tspan dy="1.2em" dx="-4.65em"> Total: {this.state.selectedCount}</tspan>}
        </text>
        </g>
      );
    }
  
    renderSlice(value, i) {
      
      const {outerRadius, innerRadius, innerRadiusFinal, innerRadiusFinal3} = this.state;
      const finalInnerRadius = this.state.hoveredSlice === i ? innerRadiusFinal3 : innerRadius
      // We'll create this component in a minute
      return (
        <Slice key={i}
               innerRadius={finalInnerRadius}
               outerRadius={outerRadius}
               innerRadiusFinal={innerRadiusFinal}
               innerRadiusFinal3={innerRadiusFinal3}
               value={value}
               label={this.props.data[i].year}
               fill={this.colorScale(i)} 
               onClickSlice={this.onClickSlice}
               onMouseOverSlice={this.onMouseOverSlice}
               onMouseOutSlice={this.onMouseOutSlice}
               ref={this.sliceRef} />
      );
    }
  }

  export default Donut;