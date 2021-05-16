import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Homescreen, Resume, NavBar, AboutMe, Contact } from '../';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab);

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
