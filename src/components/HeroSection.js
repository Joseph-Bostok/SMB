import React from 'react';
import '../App.css'; // Importing global CSS for the app
import { Button } from './Button'; // Importing the Button component
import './HeroSection.css'; // Importing CSS specific to the HeroSection component

// Function component named HeroSection
function HeroSection() {
  // Function to handle button click events
  const handleButtonClick = (source) => {
    console.log(`Selected source: ${source}`); // Logs the selected news source to the console
  };

  return (
    <div className='hero-container'> {/* Main container for the hero section */}
      <div className='hero-header'>
        <div className='hero-profile'></div> {/* Placeholder for profile image */}
        <div>
          <h1>Hello.</h1> {/* Greeting */}
        </div>
      </div>
      <div className='hero-message'>
        <p>Please select a news source to get started:</p>
      </div>
      <div className='hero-btns'> {/* Container for the buttons */}
        {/* Button for Associated Press */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          to= '/associatedpress'
        >
          Associated Press
        </Button>
        {/* Button for ADDitude */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          to='/additude'
        >
          ADDitude
        </Button>
        {/* Button for Psychology Today */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          to='/PsychologyToday'
        >
          Psychology Today
        </Button>
        {/* Button for NPR */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => handleButtonClick('NPR')}
        >
          NPR
        </Button>
        {/* Button for Women's Mental Health */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => handleButtonClick('Womens Mental Health')}
        >
          Women's Mental Health
        </Button>
      </div>
    </div>
  );
}

export default HeroSection; // Exporting the HeroSection component as the default export
