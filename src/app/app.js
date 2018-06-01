import React, { Component } from 'react';
import Routes from '../config/routes';
import List from '../list/list';
import Search from '../search/search';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Github Repos</h1>
        <Routes />
      </div>
    );
  }
}

export default App;
