import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import SplashPage from './components/SplashPage';


class App extends Component {
  render() {
    return (
      <div>
        <SplashPage/>
      </div>
    );
  }
}

export default App;
