import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';
import { withStyles } from '@material-ui/core/styles';
import { divIcon } from 'leaflet';


const styles = theme => ({
    pie : {    
        position:'relative',
        left:'10px',
        width:'400px',
        height: '400px' 
    },
    slice : {
        fontSize: '12pt',
        fontFamily: 'Verdana',
        fill: 'white', //svg specific - instead of color
        fontWeight: 'bold'	
    }
  });
  const formatAsPercentage = d3.format("%");
  const formatAsPercentage1Dec = d3.format(".1%");
  const formatAsInteger = d3.format(",");

class PieChartComponent extends React.Component {

    render() {
        const { classes } = this.props;
        let data = this.props.data;
        data = 
        [{category: "Sam", measure: 0.30},
        {category: "Peter", measure: 0.25},
        {category: "John", measure: 0.15},
        {category: "Rick", measure: 0.05},
        {category: "Lenny", measure: 0.18},
        {category: "Paul", measure:0.04},
        {category: "Steve", measure: 0.03}]

        //let width = 400;
        //let height = 400;
        let outerRadius = 150 //Math.min(width, height) / 2;
        //let innerRadius = outerRadius * .999;
        // for animation
        let innerRadiusFinal = outerRadius * .5;
        let innerRadiusFinal3 = outerRadius* .45;
        let color =  d3.scaleOrdinal(d3.schemeCategory10);
        
        const PieChart = new ReactFauxDOM.Element('PieChart');

        let vis = d3.select(PieChart)
	     .append("svg:svg")              //create the SVG element inside the <body>
	     .data([data])                   //associate our data with the document
             //.attr("width", '90%')
             .attr("viewBox", "0 0 100 100")   
             .attr("preserveAspectRatio", "xMidYMid meet")        //set the width and height of our visualization (these will be attributes of the <svg> tag
             //.attr("height", '90%')
             .attr("class", classes.pie)
	     		.append("svg:g")                //make a group to hold our pie chart
	         .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");  //move the center of the pie chart from 0, 0 to radius, radius
        
        let arc = d3.arc()        //this will create <path> elements for us using arc data
            .outerRadius(outerRadius)//.innerRadius(innerRadius);
        let arcFinal = d3.arc().outerRadius(outerRadius);
        let arcFinal3 = d3.arc().outerRadius(outerRadius);
        let pie = d3.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

        let arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
               .attr("class", classes.slice)    //allow us to style things in the slices (like text)
               .on("mouseover", mouseover)
    				.on("mouseout", mouseout)
                    .on("click", up);
                    
        arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
        .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                .append("svg:title") //mouseover title showing the figures
            .text(function(d) { return d.data.measure });			
     
        d3.selectAll("g.slice").selectAll("path").transition()
                .duration(750)
                .delay(10)
                .attr("d", arcFinal )
                ;
	  // Add a label to the larger arcs, translated to the arc centroid and rotated.
	  // source: http://bl.ocks.org/1305337#index.html
	  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
	  		.append("svg:text")
	      .attr("dy", ".35em")
	      .attr("text-anchor", "middle")
	      .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
	      //.text(function(d) { return formatAsPercentage(d.value); })
	      .text(function(d) { return d.data.measure; })
          ;
       
    // Computes the label angle of an arc, converting from radians to degrees.
       function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }

    		// Pie chart title			
		vis.append("svg:text")
        .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     .text("Revenue Share 2012")
     .attr("class","title")
     ;		    
         
        
        function mouseover() {
            d3.select(this).select("path").transition()
                .duration(750)
                            //.attr("stroke","red")
                            //.attr("stroke-width", 1.5)
                            .attr("d", arcFinal3)
                            ;
            }
            
            function mouseout() {
            d3.select(this).select("path").transition()
                .duration(750)
                            //.attr("stroke","blue")
                            //.attr("stroke-width", 1.5)
                            .attr("d", arcFinal)
                            ;
            }
            
            function up(d, i) {
        
                console.log('function up')
                        /* update bar chart when user selects piece of the pie chart */
                        //updateBarChart(dataset[i].category);
                        //updateBarChart(d.data.category, color(i));
                        //updateLineChart(d.data.category, color(i));
                    
            }
        return PieChart.toReact();
    }
}


export default withStyles(styles)(PieChartComponent);
