import React, { Component } from 'react';
import * as d3 from "d3";

class Slice extends Component {

    sliceRef = React.createRef();
    
    angle(value) {
      let a = (value.startAngle + value.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a -180 :a;  
    }

/*     componentDidUpdate() {
     d3.select(this.sliceRef.current)
     .select("path")
      .transition()
        .duration(900)
        .attr("d", d3.arc()
        .innerRadius(this.props.innerRadiusFinal3)
        .outerRadius(this.props.outerRadius))
    } */


    /*         innerRadiusFinal = outerRadius * .5;
        innerRadiusFinal3 = outerRadius* .45;
        let el = d3.select(this.sliceRef.current);
        el.transition()
        .duration(750)
        .attr("d", arcFinal); */

    render() {
      let {value, fill, innerRadius, outerRadius, label, onClickSlice, onMouseOverSlice, onMouseOutSlice} = this.props;
      // https://github.com/d3/d3/wiki/SVG-Shapes#arc
      let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      return (
        <g onClick={(e) => onClickSlice(label, fill, value)} 
           onMouseOver={(e) => onMouseOverSlice(value)}
           onMouseOut={onMouseOutSlice}
           ref={this.sliceRef}>
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