import React from 'react';
import './App.css';
import NavBar from './components/navBar'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ADDitude from './components/pages/ADDitude';
import Home from './components/pages/home'; 
import PsychologyToday from './components/pages/PsychologyToday';
import AssociatedPress from './components/pages/AssociatedPress';


/**
 * Renders the main application component.
 *
 * @return {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact element={<Home />} /> {/* Updated Route */}
          <Route path='/additude' element={<ADDitude />} /> {/* ADDitude Route */}
          <Route path='/PsychologyToday' element={<PsychologyToday />} /> {/* PsychToday Route */}
          <Route path="/associatedpress" element={<AssociatedPress />} /> {/* Associated Route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;