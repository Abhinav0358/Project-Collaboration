import React, { useState, useEffect } from "react";
import "./Collab.css";
import { useParams, useNavigate } from "react-router-dom";

export default function Collab() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", deadline: "", assignedTo: "" });
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    // CREATE SAMPLE PROJECT DATA FOR DEMONSTRATION
    const sampleProjects = [
      {
        id: 1,
        name: "E-Commerce Website",
        description: "Modern e-commerce platform with React and Node.js backend",
        domain: "Web Development",
        collaborators: "Project Creator, Alice, Bob, Sarah",
        admin: "Project Creator",
        startDate: "2025-08-01",
        deadline: "2025-09-15",
        image: null
      },
      {
        id: 2,
        name: "Mobile App UI/UX",
        description: "Design and prototype for fitness tracking mobile application",
        domain: "UI/UX Design",
        collaborators: "Project Creator, Designer Team",
        admin: "Project Creator",
        startDate: "2025-07-15",
        deadline: "2025-08-30",
        image: null
      }
    ];

    // Load project data from localStorage or use sample data
    let savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // If no projects exist, create sample projects
    if (savedProjects.length === 0) {
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
      savedProjects = sampleProjects;
    }

    const currentProject = savedProjects.find(p => p.id === parseInt(projectId)) || sampleProjects[0];
    
    if (currentProject) {
      setProject(currentProject);
      
      // CREATE SAMPLE COLLABORATORS WITH REALISTIC DATA
      const sampleCollaborators = [
        {
          id: 1,
          name: "Project Creator",
          role: "Admin",
          avatar: "👨‍💼",
          tasks: [
            {
              id: 1,
              title: "Setup project repository and initial structure",
              deadline: "2025-08-18",
              completed: true,
              createdAt: "2025-08-15T10:00:00.000Z"
            },
            {
              id: 2,
              title: "Define project requirements and scope",
              deadline: "2025-08-20",
              completed: true,
              createdAt: "2025-08-15T11:00:00.000Z"
            },
            {
              id: 3,
              title: "Review and approve final designs",
              deadline: "2025-08-25",
              completed: false,
              createdAt: "2025-08-16T09:00:00.000Z"
            }
          ],
          score: 95
        },
        {
          id: 2,
          name: "Alice Johnson",
          role: "Frontend Developer",
          avatar: "👩‍💻",
          tasks: [
            {
              id: 4,
              title: "Create responsive navigation component",
              deadline: "2025-08-22",
              completed: true,
              createdAt: "2025-08-16T14:00:00.000Z"
            },
            {
              id: 5,
              title: "Implement product catalog with search",
              deadline: "2025-08-28",
              completed: false,
              createdAt: "2025-08-16T15:00:00.000Z"
            },
            {
              id: 6,
              title: "Add shopping cart functionality",
              deadline: "2025-09-02",
              completed: false,
              createdAt: "2025-08-16T16:00:00.000Z"
            }
          ],
          score: 88
        },
        {
          id: 3,
          name: "Bob Smith",
          role: "Backend Developer",
          avatar: "👨‍💻",
          tasks: [
            {
              id: 7,
              title: "Setup database schema and models",
              deadline: "2025-08-24",
              completed: true,
              createdAt: "2025-08-16T08:00:00.000Z"
            },
            {
              id: 8,
              title: "Create user authentication API",
              deadline: "2025-08-26",
              completed: false,
              createdAt: "2025-08-16T09:30:00.000Z"
            },
            {
              id: 9,
              title: "Implement payment processing",
              deadline: "2025-09-05",
              completed: false,
              createdAt: "2025-08-16T10:30:00.000Z"
            }
          ],
          score: 92
        },
        {
          id: 4,
          name: "Sarah Williams",
          role: "UI/UX Designer",
          avatar: "👩‍🎨",
          tasks: [
            {
              id: 10,
              title: "Create wireframes and user journey maps",
              deadline: "2025-08-19",
              completed: true,
              createdAt: "2025-08-15T13:00:00.000Z"
            },
            {
              id: 11,
              title: "Design high-fidelity mockups",
              deadline: "2025-08-23",
              completed: true,
              createdAt: "2025-08-16T11:00:00.000Z"
            },
            {
              id: 12,
              title: "Create design system and style guide",
              deadline: "2025-08-27",
              completed: false,
              createdAt: "2025-08-16T12:00:00.000Z"
            }
          ],
          score: 90
        }
      ];

      setCollaborators(sampleCollaborators);
    }
  }, [projectId]);

  const addTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      deadline: newTask.deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setCollaborators(prev => 
      prev.map(collab => 
        collab.name === newTask.assignedTo 
          ? { ...collab, tasks: [...collab.tasks, task] }
          : collab
      )
    );

    setNewTask({ title: "", deadline: "", assignedTo: "" });
    setShowAddTask(false);
  };

  const toggleTaskCompletion = (collabId, taskId) => {
    setCollaborators(prev =>
      prev.map(collab =>
        collab.id === collabId
          ? {
              ...collab,
              tasks: collab.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : collab
      )
    );
  };

  const calculateProgress = (tasks) => {
    if (!tasks.length) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTaskStatusColor = (deadline, completed) => {
    if (completed) return '#3fa96a';
    const today = new Date();
    const taskDeadline = new Date(deadline);
    const daysUntilDeadline = Math.ceil((taskDeadline - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return '#ff5e32'; // Overdue
    if (daysUntilDeadline <= 3) return '#ff8a73'; // Due soon
    return '#d4a838'; // Normal
  };

  // Show loading state briefly for better UX
  if (!project) {
    return (
      <div className="collab-container">
        <div className="collab-header">
          <button onClick={() => navigate('/projects')} className="back-btn">
            ← Back to Projects
          </button>
          <h1 className="project-title">Loading...</h1>
        </div>
      </div>
    );
  }

  const overallProgress = collaborators.length > 0 
    ? Math.round(collaborators.reduce((acc, collab) => acc + calculateProgress(collab.tasks), 0) / collaborators.length)
    : 0;

  const totalTasks = collaborators.reduce((acc, collab) => acc + collab.tasks.length, 0);
  const completedTasks = collaborators.reduce((acc, collab) => acc + collab.tasks.filter(t => t.completed).length, 0);

  return (
    <div className="collab-container">
      <div className="collab-header">
        <button onClick={() => navigate('/projects')} className="back-btn">
          ← Back to Projects
        </button>
        <h1 className="project-title">{project.name}</h1>
        <p className="project-description">{project.description}</p>
        <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{color: '#d4a838', fontSize: '2rem', fontWeight: 'bold'}}>{overallProgress}%</div>
            <div style={{color: '#e5e5e5', fontSize: '0.9rem'}}>Overall Progress</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{color: '#ff8a73', fontSize: '2rem', fontWeight: 'bold'}}>{completedTasks}/{totalTasks}</div>
            <div style={{color: '#e5e5e5', fontSize: '0.9rem'}}>Tasks Completed</div>
          </div>
        </div>
      </div>

      <div className="collab-content">
        {/* Project Info Card */}
        <div className="project-info-card">
          <h3>📋 Project Overview</h3>
          <div className="project-details">
            <div className="detail-item">
              <span className="label">Domain:</span>
              <span className="value">{project.domain}</span>
            </div>
            <div className="detail-item">
              <span className="label">Start Date:</span>
              <span className="value">{formatDate(project.startDate)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Deadline:</span>
              <span className="value">{formatDate(project.deadline)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Admin:</span>
              <span className="value">{project.admin}</span>
            </div>
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="collaborators-section">
          <div className="section-header">
            <h3>👥 Team Members ({collaborators.length})</h3>
            <button 
              onClick={() => setShowAddTask(!showAddTask)}
              className="add-task-btn"
            >
              {showAddTask ? '✕ Cancel' : '+ Add Task'}
            </button>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="task-input"
              />
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                className="task-input"
              />
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                className="task-select"
              >
                <option value="">Assign to...</option>
                {collaborators.map(collab => (
                  <option key={collab.id} value={collab.name}>{collab.name}</option>
                ))}
              </select>
              <div className="task-form-actions">
                <button onClick={addTask} className="save-task-btn">Save Task</button>
                <button onClick={() => setShowAddTask(false)} className="cancel-task-btn">Cancel</button>
              </div>
            </div>
          )}

          {/* Collaborator Cards */}
          <div className="collaborators-grid">
            {collaborators.map(collab => (
              <div key={collab.id} className="collaborator-card">
                <div className="collab-header">
                  <div className="collab-avatar">{collab.avatar}</div>
                  <div className="collab-info">
                    <h4 className="collab-name">{collab.name}</h4>
                    <span className="collab-role">{collab.role}</span>
                  </div>
                  <div className="collab-progress">
                    <span className="progress-text">{calculateProgress(collab.tasks)}%</span>
                  </div>
                </div>

                <div className="tasks-section">
                  <h5>📝 Tasks ({collab.tasks?.length || 0})</h5>
                  {collab.tasks?.length > 0 ? (
                    <div className="tasks-list">
                      {collab.tasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`task-item ${task.completed ? 'completed' : 'pending'}`}
                          style={{
                            borderLeftColor: getTaskStatusColor(task.deadline, task.completed),
                            borderLeftWidth: '4px'
                          }}
                        >
                          <div className="task-content">
                            <div className="task-title">{task.title}</div>
                            <div className="task-deadline">
                              📅 {formatDate(task.deadline)}
                              {task.completed && <span style={{color: '#3fa96a', marginLeft: '0.5rem'}}>✓ Done</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleTaskCompletion(collab.id, task.id)}
                            className={`task-toggle ${task.completed ? 'completed' : 'pending'}`}
                            title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {task.completed ? '✓' : '○'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-tasks">
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
                      <div>No tasks assigned yet</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
