import React, { Component } from 'react';

import Header from './components/header.js'

class App extends Component {
  render() {
    return (
      <div>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header is-small-screen is-upgraded">
          <Header onToggleSidebar={this.toggleSidebar} />
          {
            //this.props.main (this will be populated once we start actually having pages)
          }
        </div>
      </div>
    );
  }
}

export default App;
