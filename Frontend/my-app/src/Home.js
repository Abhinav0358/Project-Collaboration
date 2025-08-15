import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to My React App 🚀</h1>
        <p>Built with ❤️ using React</p>
        <a href="#learn" className="cta-button">Get Started</a>
      </header>

      <main className="home-main" id="learn">
        <section>
          <h2>About This Project</h2>
          <p>
            This is a sample homepage built with React. You can start editing{" "}
            <code>src/Home.js</code> to make it your own.
          </p>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li>⚡ Fast and responsive</li>
            <li>🎨 Easy to customize</li>
            <li>📱 Mobile-friendly design</li>
          </ul>
        </section>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} My React App</p>
      </footer>
    </div>
  );
}
