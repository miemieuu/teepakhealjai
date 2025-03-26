import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';  // นำเข้าไฟล์ CSS สำหรับ Layout

// Pages
import Home from "./pages/Home";


function Layout() {
  return (
    <div className="layout">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
