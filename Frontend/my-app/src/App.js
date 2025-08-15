import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/projects" element={<Projects />} /> 
      </Routes>
    </Router>
  );
}
