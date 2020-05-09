import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import L from 'leaflet';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { MainListItems } from './SideBar/listItems';
import MapComponent from './MapComponent';
import Donut from './PieChart/DonutComponent';
import Chart from './BarChart/ChartComponent';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    content: {
      flexGrow: 1,
      paddingLeft: theme.spacing.unit * 7, 
      paddingTop: theme.spacing.unit * 9, 
      paddingBottom:  theme.spacing.unit * 4, 
      height: '100vh'
    },
    GridRoot: {
        display: 'flex',
        flexGrow: 1,
        flexDirection:"row",
        height: '100%'
    },
    mapGridContainer: {
      margin: '0px',
      display: 'block',
      flexGrow: 4,
      width: 'auto',
    },
    mapGridItem: {
      height: '100%'
    },
    chartsGridContainer :{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
      },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
      },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
    mainList : {
      paddingTop: '72px',
    },
    appBarSpacer: {
        minHeight: '10px'
      },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
      },
    menuButtonHidden: {
        display: 'none',
      },
      title: {
        flexGrow: 1,
      },
    drawerPaperClose: {
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: theme.spacing.unit * 7,
      },
    pieChartPaper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    barChartPaper: {
      padding: theme.spacing.unit * 2,
      marginTop: 20,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    mapPaper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '100%' 
      },
    chartGridItem: {
      width: '100%',
      minWidth: '100%',
      }
  });

class SplashPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      accPoints: [],
      hmData: [],
      countsData: [],
      years: null,
      severity: null,
      geom: null,
      selectedListItem: null,
      donutData : [
        {year: 2005, count: 134},
        {year: 2006, count: 148},
        {year: 2007, count: 156},
        {year: 2008, count: 150},
        {year: 2009, count: 171},
        {year: 2010, count: 178},
        {year: 2011, count: 183},
        {year: 2012, count: 220},
        {year: 2013, count: 201},
        {year: 2014, count: 203},
        {year: 2015, count: 206},
        {year: 2016, count: 188},
        {year: 2017, count: 166}
      ],
      barData: [
        { year: "All", severity: "Slight", count: 1934 }, 
        { year: "All", severity: "Serious", count: 362 }, 
        { year: "All", severity: "Fatal", count: 8 }, 
      ],
      barStyle : {
        fill: 'gray'
      }
    }
    this.onSelectYear = this.onSelectYear.bind(this);
    this.onResetPieChart = this.onResetPieChart.bind(this);
    this.onSelectListItem = this.onSelectListItem.bind(this);
    this.pieChartRef = React.createRef();
  }

  async getServerData(years, severity, geom) {
    try {
      const response = await axios({
        url: 'http://www.yomapo.com/edicycle/server/accidents_api.php',
        method: 'post',
        data: {
          query: `
          query AccidentsData($years: [Int], $severity: [String], $geom: [Float]) {
              total(year: $years, severity: $severity, geom: $geom) {
              year,
              count
            }, 
            accidents(year: $years , severity: $severity, geom: $geom) {
            type,
            geometry {
              type,
              coordinates
            },
            properties {
              casualty_severity,
              year,
              id
            }
          }
        }`, variables:{years, severity, geom}}});
        return response;
    } catch (error){
      alert("data not returned from Server, try again later")
      console.log(error)
    }
  }

  componentDidMount() {
    var outerScope = this;
    outerScope.getServerData(outerScope.state.years, outerScope.state.severity, outerScope.state.geom).then(response => {
      response.data.data.accidents.map(item => item.geometry.coordinates = [L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lng, L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lat]);
      const hmData = response.data.data.accidents.map(item => {return {lat:item.geometry.coordinates[1], lng:item.geometry.coordinates[0], count: 1}})
      const countsData = response.data.data.total;
      outerScope.setState({accPoints : response.data, hmData, countsData});
    }).catch(error=> {
      alert("data not returned from Server, try again later")
      console.log(error)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.years !== prevState.years) {
      this.getServerData(this.state.years, this.state.severity, this.state.geom).then(response => {
        response.data.data.accidents.map(item => item.geometry.coordinates = [L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lng, L.Projection.SphericalMercator.unproject(L.point(item.geometry.coordinates)).lat]);
        const hmData = response.data.data.accidents.map(item => {return {lat:item.geometry.coordinates[1], lng:item.geometry.coordinates[0], count: 1}})
        const countsData = response.data.data.total;
        const year = response.data.data.total.filter(item => {return item.count > 0})[0].year;
        const countsObj = response.data.data.accidents.reduce((p, c) => {
          var severity = c.properties.casualty_severity;
          if(!p.hasOwnProperty(severity)) {
            p[severity] = 0;
          }
          p[severity]++;
          return p    
        }, {});
        const barData = Object.keys(countsObj).map(item => {
          return {severity: item, count: countsObj[item], year};
        });
        this.setState({accPoints : response.data, hmData, countsData, barData});
      }).catch(error=> {
        alert("data not returned from Server, try again later")
        console.log(error)
      });
    }
  }


  onSelectYear(year, fill) {
    this.setState({
      years: [year],
      barStyle: {fill}
    });
  }

  onResetPieChart(e) {
    this.setState({
      years: null,
      severity: null,
      geom: null,
      barStyle: {fill: 'gray'}
    });
    this.pieChartRef.current.onResetPieChart()
  }

  onSelectListItem(e) {
    var selectedListItem = e.target.textContent;
    this.setState({
      selectedListItem
    });
  }

    render() { 
      const { classes } = this.props;
        return (
      <div className={classes.root}>
          <CssBaseline />
          <AppBar
            className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}>
                Edinburgh's Cycling Stats
              </Typography>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Drawer
              variant="permanent"
              classes={{
                paper: classes.drawerPaperClose,
              }}
              open={this.state.open}>
              <Divider />
              <List className={classes.mainList}>
              <MainListItems onSelectListItem={this.onSelectListItem}/>
              </List>
          </Drawer>
        <div className={classes.GridRoot}>
        <Grid container spacing={24} style={{margin: '0px'}}>
            <Grid item xs={12} md={8} style={{minHeight: '300px'}}>
              <Paper className={classes.mapPaper} elevation={2}>
              <MapComponent accPoints={this.state.accPoints} heatMapData={this.state.hmData} hmConfig={this.state.hmConfig} selectedListItem={this.state.selectedListItem}/>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.chartsGridContainer}>
            <Paper className={classes.pieChartPaper} elevation={2}>
              <svg viewBox="-10 0 50 30" preserveAspectRatio="xMidYMid meet" onClick={this.onResetPieChart}>
                <Donut data={this.state.donutData} x={15} y={15} width={60} height={15} onSelectYear={this.onSelectYear} ref={this.pieChartRef}/>
              </svg>
              </Paper>
              <Paper className={classes.barChartPaper} elevation={2}>
              <svg viewBox="-1 3 20 12" preserveAspectRatio="xMidYMid meet" >
                <Chart data={this.state.barData} width={60} height={15} barStyle={this.state.barStyle}/>
              </svg>
              </Paper>
            </Grid>
        </Grid>
      </div>
          </main>
          </div>
      );
    }
}



export default withStyles(styles)(SplashPage);

