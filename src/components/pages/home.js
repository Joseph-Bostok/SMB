import '../../App.css'; // Importing global CSS for the app
import HeroSection from '../HeroSection'; // Importing the HeroSection component
import React from 'react'; // Importing React library

// Function component named Home
function Home() {
  // The component returns a fragment with the HeroSection component inside
  return (
    <>
      <HeroSection />
    </>
  );
}

// Exporting the Home component as the default export of this module
export default Home;
