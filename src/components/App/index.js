import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, Switch as Toggle } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Homescreen, Projects, Blogs, NavBar, AboutMe, Contact } from '../';

const themeLight = createTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  toggle: {
    margin: 0,
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    position: 'fixed',
  }
}));

const App = () => {
  const [dark, setDark] = React.useState(true);

  const handleToggle = (e) => {
    setDark(e.target.checked);
  }

  const ToggleSwitch = () => {
    const classes = useStyles();
    return(
      <Toggle checked={dark} onChange={handleToggle} className={classes.toggle} />
    )
  }

  return (
    <ThemeProvider theme={dark ? themeDark : themeLight}>
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
          <Route path="/blogs">
            <Blogs />
          </Route>
          <Route path="/schoi98">
            <AboutMe />
          </Route>
          <Route path="/">
            <Homescreen/>
          </Route>
        </Switch>
        <div>
          <Contact />
        </div>
        <div>
          <ToggleSwitch />
        </div>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
