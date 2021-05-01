import React from 'react'

const NavBar = () => {
  return (
    <div>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center'
      }}>
        <button> Home </button>
        <button> Projects </button>
        <button> Resume </button>
        <button> About Me </button>
      </div>
    </div>
  )
}

export default NavBar;
