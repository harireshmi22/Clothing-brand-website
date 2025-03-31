import React from 'react'
import Topbar from '../Layout/TopBar';
import Navbar from './Navbar';
const Header = () => {
  return (
    <div>
      <header className="border-b border-gray-200">
        {/* TopBar */}
        <Topbar />
        <Navbar />
        {/* navbar*/}
        {/* Cart Drawer */}
      </header>
    </div>
  )
}

export default Header; 