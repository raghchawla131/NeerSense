import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import NeerBot from './pages/NeerBot';
import ArgoDashboard from './pages/ArgoDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/neerbot" element={<NeerBot />} />
        <Route path="/argodetails" element={<ArgoDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
