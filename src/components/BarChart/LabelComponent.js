import React, { Component } from 'react';
import * as d3 from "d3";


class Labels extends Component {

    constructor(props) {
      super(props)
    }

    labelRef = React.createRef();

    componentDidUpdate(prevProps) {
      if (prevProps.labelStyle.fill !== this.props.labelStyle.fill) {
          let label = d3.selectAll('.bar-label');
          label.transition()
              .duration(800)
              .attr("fill", this.props.labelStyle.fill)
      }
  }
  
    render() {
      //let step = (this.props.start + this.props.end / this.props.labels.length)
      let step = 6;
      
      //D3 mathy bits   
      let ticks = d3.range(this.props.start, this.props.end, step)      
      let columnLables = []
      ticks.forEach((tick, index) => {
        columnLables.push(
        <text
          class="bar-label"
          key={index} 
          fill="gray" 
          x={tick + 2} 
          y={this.props.y} 
          font-family="Verdana" 
          font-size=".55" 
          font-weight="bold"
          ref={this.labelRef}>{this.props.labels[index]}</text>)
    })

      return(
        <g  transform="translate(18,19.5) scale(-1, 1)">
            { columnLables }
        </g>
      )
    }
  
  }

  export default Labels;