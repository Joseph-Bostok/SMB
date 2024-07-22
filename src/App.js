import React from 'react';
import './App.css';
import NavBar from './components/navBar'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ADDitude from './components/pages/ADDitude';
import Home from './components/pages/home'; 

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' exact element={<Home />} /> {/* Updated Route */}
          <Route path='/additude' element={<ADDitude />} /> {/* ADDitude Route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
