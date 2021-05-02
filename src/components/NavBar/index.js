import React from 'react'
import { Link } from 'react-router-dom';

import './stylesheets.scss';

const NavBar = () => {
  return (
    <div>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center'
      }}>
        <div>
          <Link to='/'>
            <button className="button"> Home </button>
          </Link>
        </div>

        <div>
          <Link to='projects'>
            <button className="button"> Projects </button>
          </Link>
        </div>
        
        <div>
          <Link to='/resume'>
            <button className="button"> Resume </button>
          </Link>
        </div>

        <div>
          <Link to='/schoi98'>
            <button className="button"> About Me </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar;
