import React, { useState, useEffect } from "react";
import "./AddProject.css";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Set current date as default for start date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files;
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: Date.now(),
      name: projectName || "Untitled Project",
      description: description || "No description provided",
      domain: domain || "General",
      collaborators: "Project Creator", // Default value for existing Projects.js
      admin: "Project Creator", // Default value - creator is admin
      startDate: startDate || new Date().toISOString().split('T')[0],
      deadline: deadline || "Not set",
      image: image,
    };

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    existingProjects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(existingProjects));

    navigate('/projects');
  };

  return (
    <div className="add-project-container">
      <div className="add-project-card">
        <h2>Create New Project</h2>
        
        <form onSubmit={handleSubmit} className="add-project-form">
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <label className="image-upload">
              <div className="image-placeholder">
                {image ? (
                  <img src={image} alt="Project preview" />
                ) : (
                  "Click to Upload Project Image"
                )}
              </div>
              <input
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Form Fields - Only show what user needs to input */}
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />

          <input
            type="text"
            placeholder="Domain (e.g., Web Development, Mobile App)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          {/* Start Date */}
          <div className="date-input-container">
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>

          {/* Deadline Date */}
          <div className="date-input-container">
            <label htmlFor="deadline">Tentative Deadline:</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="date-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="create-btn">
              Create Project
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
