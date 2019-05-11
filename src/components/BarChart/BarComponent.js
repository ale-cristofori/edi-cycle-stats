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
            <g> {/**transform={`translate(${marginLeft}, ${marginTop})`} */}
                <rect className="bar" style={style} x={this.props.x} y={this.props.y + 5} width={this.props.width} height={this.props.height} />
            </g>
        );
    }
}



export default Bar;