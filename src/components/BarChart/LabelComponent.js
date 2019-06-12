import React, { Component } from 'react';
import * as d3 from "d3";


class Labels extends Component {

    constructor(props) {
      super(props)
    }
  
    render() {

      let style = {
        stroke: "steelblue",
        strokeWidth: "1px"
      }
      
      //let step = (this.props.start + this.props.end / this.props.labels.length)
      let step = 6;
      
      //D3 mathy bits   
      let ticks = d3.range(this.props.start, this.props.end, step)
      
      let lines = []
      ticks.forEach((tick, index) => {
        lines.push(<line key={index} style={style} x1={tick + 10 } y1={this.props.x} x2={tick + 10} y2={this.props.x + 4}  />)
      })
      
      let columnLables = []
      ticks.forEach((tick, index) => {
        columnLables.push(<text key={index} style={{fill: "steelblue"}} x={tick + 2} y={this.props.y} font-family="Verdana" font-size=".55" font-weight="bold">{this.props.labels[index]}</text>)
      })
      
    
      return(
        <g  transform="translate(18,19.5)rotate(180)">
{/*             <line x1={this.props.start} y1={this.props.x } x2={this.props.end} y2={this.props.x} style={ style } /> */}
            { columnLables }
{/*             { lines } */}
        </g>
      )
    }
  
  }

  export default Labels;