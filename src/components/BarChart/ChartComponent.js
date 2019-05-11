import React, { Component } from 'react';
import * as d3 from "d3";

//import XAxis from './XAxisComponent';
//import YAxis from './YAxisComponent';
import Bar from  './BarComponent';

class Chart extends Component {

    render() {
      let data = this.props.data
      let margin = {top: 2, right: 2, bottom: 3, left: 4.5},
        width = this.props.width - margin.left - margin.right,
        height = this.props.height - margin.top - margin.bottom;
  
      let categories = data.map((d) => d.category)
      const barsDistance = {
        0: 0,
        1: 6,
        2: 12
      }
  
      //D3 mathy bits    
      let ticks = d3.range(0, width, (width / data.length))
      let x = d3.scaleOrdinal()
        .domain(categories)
        .range(ticks)
      let y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.measure)])
        .range([height, 0])
  
      let bars = []
      let bottom = 450
      
      data.forEach((datum, index) => {
        const x = barsDistance[index];
        const newHeight = index == 2 ? height - y(datum.measure) + 0.5 : height - y(datum.measure); 
        bars.push(<Bar key={index} x={x} y={(bottom - 0.6 - (height - y(datum.measure)))* 0.0001} width={6} height={newHeight} />)
      })

      return (

        <g className="chart" transform="translate(18,19.5)rotate(180)">
        { bars }
        {/**<XAxis x={ bottom } labels={categories} start={0} end={width} />*/}
     </g>

      );
    }
  }

export default Chart;