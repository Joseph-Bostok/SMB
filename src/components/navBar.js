import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import './navBar.css';

/**
 * Renders a navigation bar component.
 *
 * @return {JSX.Element} The navigation bar component.
 */
function NavBar() {
  // State variables for the menu and button
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click); // Toggle menu visibility
  const closeMobileMenu = () => setClick(false); // Close mobile menu

  const [button, setButton] = useState(true);
  
  /**
   * Function that checks window width and sets button state accordingly.
   */
  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false); // Hide button on small screens
    } else {
      setButton(true); // Show button on larger screens
    }
  };

  // Check button visibility on component mount
  useEffect(() => {
    showButton();
  }, []);

  // Add event listener for window resize
  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className="navbar"> {/* Main navigation bar */}
        <div className="navbar-container"> {/* Container for navbar content */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            HQPsych <FontAwesomeIcon icon={faAtom} /> {/* Logo with icon */}
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <FontAwesomeIcon icon={click ? faTimes : faBars} /> {/* Toggle menu icon */}
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/Associated Press' className='nav-links' onClick={closeMobileMenu}>
                Associated Press
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/Psychology Today' className='nav-links' onClick={closeMobileMenu}>
                Psychology Today
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/ADDitude' className='nav-links' onClick={closeMobileMenu}>
                ADDitude
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle="btn--outline">HOME</Button>} {/* Render button if true */}
        </div>
      </nav>
    </>
  );
}

export default NavBar;