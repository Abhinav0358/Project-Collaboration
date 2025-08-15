import React, { useState } from "react";
import "./Collab.css"; // Import external CSS

const initialCollaborators = [
  {
    name: "Alice",
    tasks: [
      { name: "Design Mockup", deadline: "2025-08-20", completed: true },
      { name: "API Integration", deadline: "2025-08-23", completed: false },
    ],
    score: 87,
  },
  {
    name: "Bob",
    tasks: [
      { name: "Testing", deadline: "2025-08-21", completed: true },
      { name: "Documentation", deadline: "2025-08-25", completed: false },
    ],
    score: 90,
  },
];

export default function Collab() {
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    desc: "",
    started: "",
    tentativeEnd: "",
    plan: "",
    resources: "",
    notes: "",
    problems: "",
    learnings: "",
  });

  // Update projectDetail fields
  const handleInputChange = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // Mark task as completed for a collaborator
  const markTaskCompleted = (ci, ti) => {
    const updatedCollabs = [...collaborators];
    updatedCollabs[ci].tasks[ti].completed = true;
    setCollaborators(updatedCollabs);
  };

  return (
    <div className="crazy-container">
      <h1 className="crazy-heading">🚀 Collab Project Dashboard 🚀</h1>
      <div className="crazy-access-msg">
        Page accessible only to collaborators!
      </div>
      <div className="crazy-admin">Admin Access</div>

      <div className="crazy-form-section">
        <input className="crazy-textbox" name="name" value={projectDetails.name}
          onChange={handleInputChange} placeholder="Project Name" />
        <textarea className="crazy-textbox" name="desc" value={projectDetails.desc}
          onChange={handleInputChange} placeholder="Description" rows={2} />
        <input className="crazy-textbox" type="date" name="started"
          value={projectDetails.started} onChange={handleInputChange} placeholder="Started" />
        <input className="crazy-textbox" type="date" name="tentativeEnd"
          value={projectDetails.tentativeEnd} onChange={handleInputChange}
          placeholder="Tentative End" />
      </div>

      <h2 className="crazy-section-title">Collaborators & Tasks</h2>
      {collaborators.map((collab, ci) => {
        const completedTasks = collab.tasks.filter(t => t.completed).length;
        const totalTasks = collab.tasks.length;
        const percentComplete = Math.round((completedTasks / totalTasks) * 100);

        return (
          <div className="crazy-collab-card" key={ci}>
            <h3>{collab.name}</h3>
            <div className="crazy-task-list">
              {collab.tasks.map((task, ti) => (
                <div className={`crazy-task-item ${task.completed ? "crazy-complete" : "crazy-pending"}`} key={ti}>
                  <span className="crazy-task-title">{task.name}</span>
                  <span className="crazy-task-deadline">🗓 {task.deadline}</span>
                  <span className="crazy-task-status">
                    {task.completed ? "✔️ Completed" : "⏳ Pending"}
                  </span>
                  {!task.completed && (
                    <button className="crazy-action-btn"
                      onClick={() => markTaskCompleted(ci, ti)}>
                      Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="crazy-score">
              <span>Completed:</span>
              <span className="crazy-percent">{percentComplete}%</span>
              <span>Cumulative Score:</span>
              <span className="crazy-score-value">{collab.score}</span>
            </div>
          </div>
        );
      })}

      <div className="crazy-form-section">
        <textarea className="crazy-textbox" name="plan" value={projectDetails.plan}
          onChange={handleInputChange} placeholder="Plan of Action" rows={2} />
        <textarea className="crazy-textbox" name="resources" value={projectDetails.resources}
          onChange={handleInputChange} placeholder="Resources" rows={2} />
        <textarea className="crazy-textbox" name="notes" value={projectDetails.notes}
          onChange={handleInputChange} placeholder="Notes & Reflections" rows={2} />
        <textarea className="crazy-textbox" name="problems" value={projectDetails.problems}
          onChange={handleInputChange} placeholder="Problems" rows={2} />
        <textarea className="crazy-textbox" name="learnings" value={projectDetails.learnings}
          onChange={handleInputChange} placeholder="Learnings" rows={2} />
      </div>

      <div className="crazy-admin-actions">
        <button className="crazy-action-btn">Save / Update</button>
        <button className="crazy-action-btn crazy-del-btn">Delete Project</button>
        <button className="crazy-action-btn crazy-admin-btn">Allot Admin Access</button>
        <button className="crazy-action-btn crazy-complete-btn">Mark Completed</button>
      </div>
    </div>
  );
}
