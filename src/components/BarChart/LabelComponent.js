import React, { Component } from 'react';
import * as d3 from "d3";


class Labels extends Component {

    constructor(props) {
      super(props)
    }
  
    render() {

      const {labelStyle} = this.props;
      
      //let step = (this.props.start + this.props.end / this.props.labels.length)
      let step = 6;
      
      //D3 mathy bits   
      let ticks = d3.range(this.props.start, this.props.end, step)      
      let columnLables = []
      ticks.forEach((tick, index) => {
        columnLables.push(<text key={index} style={labelStyle} x={tick + 2} y={this.props.y} font-family="Verdana" font-size=".55" font-weight="bold">{this.props.labels[index]}</text>)
      })
      
    
      return(
        <g  transform="translate(18,19.5)rotate(180)">
            { columnLables }
        </g>
      )
    }
  
  }

  export default Labels;