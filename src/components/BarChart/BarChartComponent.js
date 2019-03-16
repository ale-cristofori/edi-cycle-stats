import React, { Component } from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data, marginLeft, marginTop} = this.props;
        return(
            <g transform={`translate(${marginLeft}, ${marginTop})`}>
            <rect/>
            </g>
        );
    }
}



export default BarChart;
