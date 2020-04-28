import React, { Component } from 'react';
import * as d3 from "d3";

class Bar extends Component {
    constructor(props) {
        super(props);
    }

    rectRef = React.createRef();
    countsLabelRef = React.createRef();

    componentDidUpdate(prevProps) {
        if (prevProps.barStyle.fill !== this.props.barStyle.fill) {
            let rect = d3.select(this.rectRef.current);
            let countsLabel = d3.select(this.countsLabelRef.current);
            rect.transition()
                .duration(800)
                .attr("fill", this.props.barStyle.fill)
            countsLabel.transition()
                .duration(800)
                .attr("fill", this.props.barStyle.fill)
        }
    }

    render() {
        return(
            <g>
            <text 
              ref={this.countsLabelRef}
              fill="gray"
              y={((this.props.y + 5.3) + this.props.height) * -1} 
              x={(this.props.x + this.props.width)}
              text-anchor="end"
              font-family="Verdana" 
              font-size=".55" 
              font-weight="bold">{this.props.value}
            </text>
                <rect 
                    className="bar" 
                    fill="gray"
                    transform="scale(1, -1)"
                    x={this.props.x} 
                    y={this.props.y + 5} 
                    width={this.props.width} 
                    height={this.props.height}
                    ref={this.rectRef}
                />
            </g>
        );
    }
}



export default Bar;