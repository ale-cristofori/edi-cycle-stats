import React, { Component } from 'react';
import * as d3 from "d3";

class Slice extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      hoveredSlice: {
        index: null,
        hoveredSAngle: null,
        hoveredEAngle: null
      }
    }
  }

    sliceRef = React.createRef();
    
    angle(value) {
      let a = (value.startAngle + value.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a -180 :a;  
    }

    onMouseOverSlice(value) {
      this.setState({
        hoveredSlice: {
          index : value.index,
          hoveredSAngle: value.startAngle,
          hoveredEAngle: value.endAngle
        }
      });
    }

    onMouseOutSlice(value) {
      this.setState({
        hoveredSlice: {
          index : null,
          hoveredSAngle: value.startAngle,
          hoveredEAngle: value.endAngle
        }
      });
    }

    componentDidUpdate(prevProps, prevState) {
      let arcFinal3;
      let el = d3.select(this.sliceRef.current);
      if (this.state.hoveredSlice.index !== null) {
        arcFinal3 = d3.arc().innerRadius(this.props.innerRadiusFinal3).outerRadius(this.props.outerRadius)
        .startAngle(this.state.hoveredSlice.hoveredSAngle)
        .endAngle(this.state.hoveredSlice.hoveredEAngle);
        el.select("path")
        .transition()
          .duration(600)
          .attr("d", arcFinal3)
      } 
      else if (this.state.hoveredSlice.index == null && prevState.hoveredSlice.index !== null) {
      arcFinal3 = d3.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius)
      .startAngle(this.state.hoveredSlice.hoveredSAngle)
      .endAngle(this.state.hoveredSlice.hoveredEAngle);
      el.select("path")
      .transition()
        .duration(600)
        .attr("d", arcFinal3)
    }
  }

    render() {
      let {value, fill, innerRadius, outerRadius, label, onClickSlice} = this.props;
      let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      return (
        <g onClick={(e) => {e.stopPropagation(); onClickSlice(label, fill, value)}} 
           onMouseOver={(e) => this.onMouseOverSlice(value)}
           onMouseOut={(e) => this.onMouseOutSlice(value)}
           className="slice"
           ref={this.sliceRef}
           index={this.props.index}>
          <path d={arc(value)} fill={fill} />
          <text transform={`translate(${arc.centroid(value)}) rotate(${this.angle(value)})`}
                dy=".35em"
                textAnchor="middle"
                fill="white"
                style={{
                    fontSize: "1px", 
                    fontFamily: "verdana", 
                    fontWeight: "bold"
                  }}>
                {label}
          </text>
        </g>
        
      );
    }
  }

  export default Slice;