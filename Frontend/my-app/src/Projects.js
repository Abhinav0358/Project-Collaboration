import React, { useState } from "react";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      name: "New Project",
      description: "Description here",
      domain: "Web Development",
      collaborators: "Alice, Bob",
      admin: "Charlie",
      image: null,
    };
    setProjects([...projects, newProject]);
  };

  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, image: URL.createObjectURL(file) } : p
        )
      );
    }
  };

  return (
    <div className="projects-container">
      <h1>Projects</h1>

      {projects.length === 0 && (
        <p className="empty-msg">No projects yet. Click "Add Project" to create one.</p>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <label className="image-upload">
              {project.image ? (
                <img src={project.image} alt="Project" />
              ) : (
                <div className="image-placeholder">Upload Image</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, project.id)}
              />
            </label>
            <div className="project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Domain:</strong> {project.domain}</p>
              <p><strong>Collaborators:</strong> {project.collaborators}</p>
              <p><strong>Admin:</strong> {project.admin}</p>
              <button className="view-btn">View Project</button>
            </div>
          </div>
        ))}

        {/* Always visible Add Project Card */}
        <div className="add-card" onClick={handleAddProject}>
          <h3>➕ Add Project</h3>
        </div>
      </div>
    </div>
  );
}
