import React, { Component } from 'react';
import logo from '../../src/logo.svg';
import styled, { keyframes }from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column'
    },
    GridRoot: {
        flexGrow: 1,
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
    appBarSpacer: {
        minHeight: '82px'
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
    mapGrid: {
        position: 'relative',
        bottom: '74.5px',
      },
  });

class SplashPage extends Component {
    state = {
        open: false,
      };

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
            <List>{mainListItems}</List>
            <Divider />
            <List>{secondaryListItems}</List>
        </Drawer>
        <div className={classes.GridRoot}>
      <Grid container spacing={24} justify='flex-end' wrap='wrap-reverse'>
        <Grid item xs={7} className={classes.mapGrid}>
          <Paper className={classes.mapPaper}>
          <div>
          <MapComponent/>
          </div>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper}>xs=5</Paper>
        </Grid>
        <Grid item xs={5}>
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

