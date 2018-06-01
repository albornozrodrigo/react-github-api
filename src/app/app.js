import React, { Component } from 'react';
import List from '../list/list';
import Search from '../search/search';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Github Repos</h1>
        <Search />
      </div>
    );
  }
}

export default App;
