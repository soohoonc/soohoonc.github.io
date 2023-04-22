import * as React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Homescreen, Projects, Blog, Blogs, AboutMe, WorkExperience, Contact, NavBar } from '../components';

const TopLevelLayout = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
            <Contact />
        </div>
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