import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, Switch as Toggle } from '@mui/material';

import { ThemeProvider } from '@mui/material/styles';

import { Homescreen, Projects, Blogs, NavBar, AboutMe, Contact } from '../';
import { themeLight, themeDark } from './theme'

const App = () => {

  const [dark, setDark] = React.useState(true);

  const handleToggle = (e) => {
    setDark(e.target.checked);
  }

  const theme = dark ? themeDark : themeLight;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Router>
        <div>
          <NavBar />
        </div>
        <Switch>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route exact path="/blogs">
            <Blogs />
          </Route>
          <Route path="/schoi98">
            <AboutMe />
          </Route>
          <Route exact path="/">
            <Homescreen/>
          </Route>
        </Switch>
        <div>
          <Contact />
        </div>
        <div>
        <Toggle checked={dark} onChange={handleToggle} sx={{
          margin: 0,
          top: 'auto',
          right: theme.spacing(2),
          bottom: theme.spacing(2),
          left: 'auto',
          position: 'fixed',
        }} />
        </div>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
