import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Homescreen, Projects, NavBar, AboutMe, Contact } from '../';

const App = () => {
  return (
    <div>
      <Router>
      <div>
        <NavBar />
      </div>
      <Switch>
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
      <div>
        <Contact />
      </div>
    </Router>
    </div>
    
  );
}

export default App;
