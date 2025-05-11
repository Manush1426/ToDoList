import React from 'react'

const Navbar = () => {
    return (
        <div>
            <nav className='navbar'>
                <div className="logo-div">
                    <span className='logo'>iTask</span>
                </div>
                <div className='widgets'>
                    <ul className="">
                        <li className=''>Home</li>
                        <li className=''>Your Tasks</li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
