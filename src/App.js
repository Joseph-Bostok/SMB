import React from 'react';
import './App.css';
import NavBar from './components/navBar'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/pages/home'; 

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' exact element={<Home />} /> {/* Updated Route */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
