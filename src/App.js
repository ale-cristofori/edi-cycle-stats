import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import SplashPage from './components/SplashPage';


class App extends Component {
  render() {
    return (
      // <div>
      <Router>
      <CssBaseline />
      <Route exact={true} path="/" component={Dashboard}/>
      <Route path="/grid" component={SplashPage}/>
      </Router>
      // </div>
    );
  }
}

export default App;
