import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Homescreen, Resume, NavBar, Projects, AboutMe } from '../';

const App = () => {
  return (
    <div>
      
      <Router>
      <div>
        <NavBar />
      </div>
      <Switch>
        <Route path="/resume">
          <Resume />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/schoi98">
          <AboutMe />
        </Route>
        <Route>
          <Homescreen />
        </Route>
      </Switch>
    </Router>
    </div>
    
  );
}

export default App;
