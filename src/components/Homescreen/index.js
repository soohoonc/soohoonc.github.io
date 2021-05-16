import React from 'react';

import './stylesheets.scss';

const Homescreen = () => {
  return (
    <div style={{
      display:'flex', justifyContent: 'center', flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'center'
      }}>
        <h1>Welcome to My Website</h1>
      </div>
      <div>
        <p>
          I am a 3rd year Computer Science and Mathematics major at the Georgia Institute of Technology interested artificial intelligence, databases, and applied mathematics.
          Outside of school I enjoy painting and problem solving for fun.
        </p>
        <p>
          This website is under construction, I am working on my finals right now and I
          should be studying but here I am trying to rebuild my website after learning 
          some JavaScript and React.
        </p>
      </div>
    </div>
  )
}

export default Homescreen;
