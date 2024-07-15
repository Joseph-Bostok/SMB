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
      <video src='/videos/video-1.mp4' autoPlay loop muted /> {/* Background video */}
      <h1>Welcome</h1> {/* Hero section heading */}
      <p>Please select a news source to get started</p> {/* Hero section subheading */}
      <div className='hero-btns'> {/* Container for the buttons */}
        {/* Button for Associated Press */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => handleButtonClick('Associated Press')}
        >
          Associated Press
        </Button>
        {/* Button for ADDitude */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => handleButtonClick('ADDitude')}
        >
          ADDitude
        </Button>
        {/* Button for Psychology Today */}
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={() => handleButtonClick('Psychology Today')}
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
