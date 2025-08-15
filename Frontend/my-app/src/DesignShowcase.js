import React, { useState } from 'react';
import './DesignShowcase.css';
import { useNavigate } from 'react-router-dom';

export default function DesignShowcase() {
  const [selectedTheme, setSelectedTheme] = useState('current');
  const navigate = useNavigate();

  const themes = [
    {
      id: 'current',
      name: 'Current Orange/Gold',
      description: 'Warm, professional, innovative feeling',
      colors: ['#ff5e32', '#ff8a73', '#d4a838', '#1b3a2b'],
      preview: 'Current design with enhanced 3D effects'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Blue/Purple',
      description: 'Futuristic, tech-focused, gaming inspired',
      colors: ['#00f5ff', '#bf00ff', '#1e3a8a', '#0f0f23'],
      preview: 'Neon glows, holographic effects, cyber aesthetics'
    },
    {
      id: 'nature',
      name: 'Nature Green/Teal',
      description: 'Organic, eco-friendly, calm and trustworthy',
      colors: ['#10b981', '#06b6d4', '#065f46', '#0f172a'],
      preview: 'Organic shapes, flowing animations, nature-inspired'
    },
    {
      id: 'neon',
      name: 'Neon Pink/Red',
      description: 'Bold, energetic, creative and dynamic',
      colors: ['#f97316', '#ec4899', '#dc2626', '#1f2937'],
      preview: 'High contrast, electric effects, vibrant energy'
    },
    {
      id: 'monochrome',
      name: 'Monochrome Silver',
      description: 'Professional, clean, timeless elegance',
      colors: ['#f8fafc', '#64748b', '#334155', '#0f172a'],
      preview: 'Subtle gradients, refined shadows, premium feel'
    },
    {
      id: 'gradient',
      name: 'Rainbow Gradient',
      description: 'Creative, playful, modern and diverse',
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
      preview: 'Dynamic gradients, color transitions, vibrant UI'
    },
    {
      id: 'minimalist',
      name: 'Minimalist White',
      description: 'Clean, simple, focus on content',
      colors: ['#ffffff', '#f3f4f6', '#6b7280', '#111827'],
      preview: 'Subtle effects, clean lines, maximum clarity'
    },
    {
      id: 'retro',
      name: 'Retro Synthwave',
      description: 'Nostalgic, 80s inspired, fun and unique',
      colors: ['#ff1493', '#00ffff', '#ffff00', '#4b0082'],
      preview: 'Retro gradients, vintage effects, nostalgic vibes'
    }
  ];

  const handleApplyTheme = (themeId) => {
    // This would apply the theme to your actual project
    localStorage.setItem('selectedTheme', themeId);
    alert(`Theme "${themes.find(t => t.id === themeId)?.name}" applied! Refresh to see changes.`);
  };

  const handleBackToProject = () => {
    navigate('/projects');
  };

  return (
    <div className={`showcase-container theme-${selectedTheme}`}>
      {/* Header */}
      <div className="showcase-header">
        <button className="back-button" onClick={handleBackToProject}>
          ← Back to Project
        </button>
        <h1 className="showcase-title">Design Theme Gallery</h1>
        <p className="showcase-subtitle">Choose your perfect design aesthetic</p>
      </div>

      {/* Theme Selector Tabs */}
      <div className="theme-tabs">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`theme-tab ${selectedTheme === theme.id ? 'active' : ''}`}
            onClick={() => setSelectedTheme(theme.id)}
            style={{
              '--theme-color': theme.colors[0],
              '--theme-secondary': theme.colors[1]
            }}
          >
            <div className="theme-colors">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="color-dot"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>

      {/* Current Theme Preview */}
      <div className="current-theme-display">
        <div className="theme-info">
          <h2>{themes.find(t => t.id === selectedTheme)?.name}</h2>
          <p>{themes.find(t => t.id === selectedTheme)?.description}</p>
          <div className="color-palette">
            {themes.find(t => t.id === selectedTheme)?.colors.map((color, index) => (
              <div key={index} className="color-swatch">
                <div className="color-circle" style={{ backgroundColor: color }}></div>
                <span className="color-code">{color}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="apply-theme-section">
          <button 
            className="apply-theme-btn"
            onClick={() => handleApplyTheme(selectedTheme)}
          >
            Apply This Theme
          </button>
        </div>
      </div>

      {/* Component Previews */}
      <div className="component-previews">
        <h3>Component Previews</h3>
        
        {/* Card Preview */}
        <div className="preview-section">
          <h4>Project Cards</h4>
          <div className="preview-cards">
            <div className="sample-card">
              <div className="card-header">
                <div className="card-icon">🚀</div>
                <h5>Sample Project</h5>
              </div>
              <p className="card-description">
                This is how your project cards will look with the selected theme.
              </p>
              <div className="card-meta">
                <span className="meta-item">Web Development</span>
                <span className="meta-item">5 collaborators</span>
              </div>
              <button className="card-button">View Project</button>
            </div>
          </div>
        </div>

        {/* Button Previews */}
        <div className="preview-section">
          <h4>Buttons & Interactions</h4>
          <div className="button-samples">
            <button className="sample-btn primary">Primary Button</button>
            <button className="sample-btn secondary">Secondary Button</button>
            <button className="sample-btn outline">Outline Button</button>
          </div>
        </div>

        {/* Form Previews */}
        <div className="preview-section">
          <h4>Form Elements</h4>
          <div className="form-samples">
            <input className="sample-input" placeholder="Sample input field" />
            <textarea className="sample-textarea" placeholder="Sample textarea" rows="3"></textarea>
          </div>
        </div>

        {/* Navigation Preview */}
        <div className="preview-section">
          <h4>Navigation</h4>
          <nav className="sample-nav">
            <a href="#" className="nav-item active">Projects</a>
            <a href="#" className="nav-item">Add Project</a>
            <a href="#" className="nav-item">Collaboration</a>
            <a href="#" className="nav-item">Settings</a>
          </nav>
        </div>
      </div>

      {/* 3D Effects Demo */}
      <div className="effects-demo">
        <h3>3D Effects & Animations</h3>
        <div className="effects-grid">
          <div className="effect-card hover-lift">
            <h5>Hover Lift</h5>
            <p>3D elevation on hover</p>
          </div>
          <div className="effect-card tilt-effect">
            <h5>Tilt Effect</h5>
            <p>Dynamic perspective tilt</p>
          </div>
          <div className="effect-card glow-effect">
            <h5>Glow Effect</h5>
            <p>Dynamic glow and shadows</p>
          </div>
          <div className="effect-card morphing">
            <h5>Morphing</h5>
            <p>Shape transformation</p>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="installation-guide">
        <h3>How to Apply Themes</h3>
        <div className="guide-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Select Theme</h4>
              <p>Click on any theme tab above to preview it</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Preview Components</h4>
              <p>See how all UI elements look with the selected theme</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Apply Theme</h4>
              <p>Click "Apply This Theme" to use it in your project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}