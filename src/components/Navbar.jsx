import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
    return (
        <div>
            <nav className='navbar'>
                <div className="logo-div">
                    <span className='logo'>iTask</span>
                </div>
                <div className='widgets'>
                    <ul className="">
                        <li>
                        <NavLink to={"/about"} className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>About</NavLink>
                        </li>
                        <li className=''>Your Tasks</li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
