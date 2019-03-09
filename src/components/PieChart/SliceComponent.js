import React, { Component } from 'react';
import * as d3 from "d3";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

    sliceText: {
        fontSize: '1px',
        fontWeight: 'bold',
        fontFamily: theme.typography.fontFamily
    }

});

class Slice extends Component {

    constructor(props) {
        super(props);
        this.state = {isHovered: false};
        this.onMouseOver = this.onMouseOver.bind(this);
        //this.onMouseOut = this.onMouseOut.bind(this);
    }
    
    onMouseOver() {
        this.setState({isHovered: true});
        this.props.onMouseOver(this.props.year)
    }
    
    onMouseOut() {
        this.props.onMouseOut()
        this.setState({isHovered: false});
    }

    
    render() {
      const { classes } = this.props;
      let {value, label, fill, innerRadius = 0, outerRadius, cornerRadius, padAngle, ...props} = this.props;
      // https://github.com/d3/d3/wiki/SVG-Shapes#arc
      if (this.state.isHovered) {
        outerRadius *= 0.9;
      }
      let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
      return (
        <g  onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            {...props}>
            <path d={arc(value)} fill={fill} />
            <text transform={`translate(${arc.centroid(value)})`}
                  dy=".35em"
                  textAnchor="middle"
                  fill="white"
                  className={classes.sliceText}>
                {label}
            </text>
          </g>
      );
    }
  }

  export default withStyles(styles)(Slice);