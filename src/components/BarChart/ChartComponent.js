import React, { Component } from 'react';
import * as d3 from "d3";

import Bar from  './BarComponent';
import Labels from './LabelComponent';

class Chart extends Component {

    render() {
      let {data} = this.props;
      const {barStyle} = this.props;
      if(data.filter(item => {return item['severity'] === 'Fatal'}).length === 0) {
        data.push({year: data[0].year, severity: 'Fatal', count:  0});
      }
      data.sort((a, b)=> {
        const sortOrder = {'Slight':1, 'Serious':2, 'Fatal':3};
        return sortOrder[a.severity] - sortOrder[b.severity];
      });
      let margin = {top: 2, right: 2, bottom: 3, left: 4.5},
      width = this.props.width - margin.left - margin.right,
      height = this.props.height - margin.top - margin.bottom;
      let severities = data.map(d => d.severity);
      const barsDistance = {
        0: 0,
        1: 6,
        2: 12
      }
  
      //D3 mathy bits    
      let ticks = d3.range(0, width, (width / data.length))
      let x = d3.scaleOrdinal()
        .domain(severities)
        .range(ticks)
      let y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .range([height, 0])
  
      let bars = []
      let bottom = 4.5
      
      data.forEach((datum, index) => {
        const x = barsDistance[index];
        let newHeight = (height - y(datum.count) );
        if (index === 2 && datum.count === 0) {
          newHeight = newHeight + 0.2;
        } 
        else if (index === 2 && datum.count > 0){
          newHeight = newHeight + 0.5;
        }
        bars.push(
          <g>
            <Bar 
              key={index} 
              x={x} 
              y={(bottom - 0.6 - (height - y(datum.count)))* 0.0001} 
              width={6} 
              height={newHeight} 
              value={datum.count} 
              barStyle={barStyle}/> 
          </g>
        )
      })

      return (
        <g className="chart" transform="translate(0,19)">
          { bars }
          <Labels x={4.5} y={-4.4} labels={severities} start={0} end={18} labelStyle={barStyle}/>
        </g>
      );
    }
  }

export default Chart;