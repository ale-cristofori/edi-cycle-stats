import React, { Component } from 'react';
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
