import React from 'react';

import './stylesheets.scss';

const Homescreen = () => {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'center'
      }}>
        <h1>Welcome to My Website</h1>
      </div>
      <div>
        <p>
          I am (now) a 3rd year Computer Science and Mathematics major at Georgia Tech.
          Outside of school I enjoy painting and problem solving for fun.
        </p>
        <p>
          This website is under construction, I am working on my finals right now and I
          should be studying but here I am trying to rebuild my website after learning 
          some JavaScript and React.
        </p>
      </div>
      <div>
        Links to my socials:
        <br/>
        <a href="https://github.com/schoi98" target="_blank">GitHub</a>
        <br/>
        <a href="https://www.linkedin.com/in/soohoonchoi/" target="_blank">LinkedIn</a>
      </div>
    </div>
  )
}

export default Homescreen;
