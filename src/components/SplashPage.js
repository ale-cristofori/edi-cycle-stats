import React, { Component } from 'react';
import logo from '../../src/logo.svg';
import styled, { keyframes } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import L from 'leaflet';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { mainListItems, secondaryListItems } from './listItems';
import MapComponent from './MapComponent';
import Donut from './PieChart/DonutComponent';

const styles = theme => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column'
    },
    content: {
      flexGrow: 1,
      paddingLeft: theme.spacing.unit * 7, 
      paddingTop: theme.spacing.unit * 9, 
      paddingBottom:  theme.spacing.unit * 4, 
      height: '100vh',
      overflow: 'auto',
    },
    GridRoot: {
        display: 'flex',
        flexGrow: 1,
        flexDirection:"row",
    },
    mapGridContainer :{
      margin: '0px',
      display: 'block',
      flexGrow: 4,
      width: 'auto',
    },
    chartsGridContainer :{
      margin: '0px',
      flexGrow: 2,
      display: 'block',
      width: 'auto',
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
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    mapPaper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    chartGridItem: {
      width: '100%',
      minWidth: '100%',
      },
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
      donutData :[
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
]
    }
    this.onSelectYear = this.onSelectYear.bind(this);
    this.onResetPieChart = this.onResetPieChart.bind(this);
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
        this.setState({accPoints : response.data, hmData, countsData});
      }).catch(error=> {
        alert("data not returned from Server, try again later")
        console.log(error)
      });
    }
  }


  onSelectYear(year) {
    this.setState({
      years: [year]
    });
  }

  onResetPieChart(e) {
    this.setState({
      years: null,
      severity: null,
      geom: null
    });
    this.pieChartRef.current.onResetPieChart()
  }

    render() { 
      const { classes } = this.props;
        return (
      <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
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
              <List className={classes.mainList}>{mainListItems}</List>
          </Drawer>
        <div className={classes.GridRoot}>
        <Grid container spacing={24} className={classes.mapGridContainer}> 
          <Grid item xs={12}>
            <Paper className={classes.mapPaper}>
            <MapComponent accPoints={this.state.accPoints} heatMapData={this.state.hmData} hmConfig={this.state.hmConfig}/>
            </Paper>
          </Grid>
          </Grid>
          <Grid container spacing={24}  className={classes.chartsGridContainer}> 
          <Grid item xs={6} className={classes.chartGridItem}>
          <Paper className={classes.mapPaper}>
          <svg viewBox="-10 0 50 30" preserveAspectRatio="xMidYMid meet" onClick={this.onResetPieChart}>
            <Donut data={this.state.donutData} x={15} y={15} onSelectYear={this.onSelectYear} ref={this.pieChartRef}/>
          </svg>
          </Paper>
          </Grid>
          <Grid item xs={6} className={classes.chartGridItem}>
              <Paper className={classes.paper}>xs=5</Paper>
          </Grid>
        </Grid>
      </div>
          </main>
          </div>
      );
    }
}



export default withStyles(styles)(SplashPage);

