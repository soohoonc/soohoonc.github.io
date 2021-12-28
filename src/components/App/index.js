import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { CssBaseline, Switch as Toggle } from '@mui/material';

import { ThemeProvider } from '@mui/material/styles';

import { Homescreen, Projects, Blog, Blogs, NavBar, AboutMe, Contact } from '../';
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
          <Route path="/projects" component={Projects} />
          <Route exact path="/blogs">
            <Blogs theme={theme} />
          </Route>
          <Route path="/blogs/:id" component={Blog} />
          <Route path="/schoi98" component={AboutMe} />
          <Route exact path="/" component={Homescreen} />
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
