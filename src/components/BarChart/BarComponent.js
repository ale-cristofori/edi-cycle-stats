import React, { Component } from 'react';
import * as d3 from "d3";

class Bar extends Component {
    constructor(props) {
        super(props);
    }

    rectRef = React.createRef();
    countsLabelRef = React.createRef();

    componentDidUpdate(prevProps) {
        let rect = d3.select(this.rectRef.current);
        let countsLabel = d3.select(this.countsLabelRef.current);

        if ((prevProps.barStyle.fill !== this.props.barStyle.fill)) {
            rect.transition()
                .duration(650)
                .attr("fill", this.props.barStyle.fill)
                .transition()
                .duration(650)
                .attr("height", this.props.height)
                countsLabel.transition()
                .duration(650)
                .attr("fill", this.props.barStyle.fill)
        }

        if(prevProps.y !== this.props.y) {
            countsLabel.transition()
            .duration(650)
            .attr("y", ((this.props.y + 5.3) + this.props.height) * -1)
        }

        if ((prevProps.height !== this.props.height)) {
            rect.transition()
                .duration(650)
                .attr("height", this.props.height)
        }
    }

    componentDidMount() {
        let rect = d3.select(this.rectRef.current);
        let countsLabel = d3.select(this.countsLabelRef.current);
        rect.transition()
            .duration(650)
            .attr("height", this.props.height);
        countsLabel.transition()
            .duration(650)
            .attr("y", ((this.props.y + 5.3) + this.props.height) * -1);
    }
        
    render() {
        return(
            <g>
            <text 
              ref={this.countsLabelRef}
              fill="gray"
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
                    ref={this.rectRef}
                />
            </g>
        );
    }
}



export default Bar;