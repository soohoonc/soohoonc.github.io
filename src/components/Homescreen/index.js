import React from 'react'

import { NavBar } from '../';

const Homescreen = () => {
  return (
    <div>
      <NavBar />
      <div style={{
        display: 'flex', justifyContent: 'center'
      }}>
        <h1>Welcome to My Website</h1>
      </div>
      <div>
        <p>
          The website is currently under construction,
          I will work on it after finals are over...
        </p>
      </div>
    </div>
  )
}

export default Homescreen;
