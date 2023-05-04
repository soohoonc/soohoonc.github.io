import * as React from 'react';
import { useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Homescreen, Projects, Blog, Blogs, AboutMe, WorkExperience, Contact, NavBar } from '../components';
import { ThemeProvider } from '@mui/material/styles'
import {darkTheme, lightTheme } from '../themes'
import { CssBaseline, Switch } from '@mui/material';

const TopLevelLayout = () => {

    const toggleTheme = () => {
        setTheme(theme === darkTheme ? lightTheme : darkTheme);
    };

    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [theme, setTheme] = useState(getCurrentTheme() ? darkTheme : lightTheme);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Switch onChange={toggleTheme} sx={{
                margin: 0,
                top: 'auto',
                right: theme.spacing(2),
                bottom: theme.spacing(2),
                left: 'auto',
                position: 'fixed',
                }} />
                <NavBar/>
                <Outlet />
                <Contact />
        </ThemeProvider>
    );
};


const router = createBrowserRouter([
    {
        path: '/',
        element: <TopLevelLayout />,
        children:[
            { path: '/experience', element: <WorkExperience /> },
            { path: '/projects', element: <Projects/> },
            { path: '/blogs', element: <Blogs/> },
            { path: '/blogs/:id', element: <Blog/> },
            { path: '/schoi98', element: <AboutMe/> },
            { path: '/', element: <Homescreen/> },
        ]
    }
]);

export default router;