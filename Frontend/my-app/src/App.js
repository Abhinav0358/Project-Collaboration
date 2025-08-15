import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import Login from "./Login";
import Register from "./Register";
import AddProject from "./AddProject";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
