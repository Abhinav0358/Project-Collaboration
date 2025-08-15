import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />        {/* Home page */}
        <Route path="/login" element={<Login />} />  {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
      </Routes>
    </Router>
  );
}
