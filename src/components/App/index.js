import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Homescreen, Resume } from '../';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/resume">
          <Resume />
        </Route>
        <Route>
          <Homescreen />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
