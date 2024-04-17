// Root.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import PropertyDetails from './PropertyDetails.js';

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/property/:id" element={<PropertyDetailsWrapper />} />
      </Routes>
    </Router>
  );
};

// Wrapper component to use useLocation
const PropertyDetailsWrapper = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id'); // Assuming the URL might be something like /?id=123

  return <PropertyDetails id={id} />;
};

export default Root;
