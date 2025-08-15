import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import Login from "./Login";
import Register from "./Register";
import AddProject from "./AddProject";
import Collab from "./collab";
import DesignShowcase from "./DesignShowcase";

// Add this route:

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/design" element={<DesignShowcase />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/" element={<Login />} />
        <Route path="/view" element={<Collab />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
