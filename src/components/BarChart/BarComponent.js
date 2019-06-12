import React, { Component } from 'react';
import * as d3 from "d3";

class Bar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let style = {
            fill: "steelblue"
          }
        return(
            <g>
            <text 
              style={{fill: "steelblue"}} 
              x={this.props.x - 6} 
              y={this.props.y + 5.5 + this.props.height} 
              transform={`rotate(180 ${this.props.x} ${this.props.y + 5.5 + this.props.height})`}
              font-family="Verdana" 
              font-size=".55" 
              font-weight="bold">{this.props.value}
            </text>
                <rect className="bar" style={style} x={this.props.x} y={this.props.y + 5} width={this.props.width} height={this.props.height} />
            </g>
        );
    }
}



export default Bar;