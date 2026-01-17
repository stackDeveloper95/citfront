import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';
import "./homePage.css";
import { Link } from "react-router-dom";

const features = [
  {
    title: 'Upload and spotlight',
    copy: 'Drop in your project, enrich it with a cover image, and ship it in seconds.',
    action: 'Upload now',
    to: '/upload'
  },
  {
    title: 'Explore the library',
    copy: 'Browse hand-curated student builds across departments with beautiful previews.',
    action: 'Browse projects',
    to: '/project'
  },
  {
    title: 'Chat with PDFs',
    copy: 'Ask questions against any uploaded PDF and get concise answers powered by retrieval.',
    action: 'Start a chat',
    to: '/project'
  }
];

const steps = [
  {
    label: 'Upload',
    detail: 'Add your PDF and hero image. We create a unique ID and prep your file for chat.',
  },
  {
    label: 'Embed',
    detail: 'We extract text, build embeddings, and ready your project for search.',
  },
  {
    label: 'Ask',
    detail: 'Share the profile or open a chat to get instant, sourced answers.',
  },
];

function HomePage() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((prev) => !prev), 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="home" className="page-shell">
      <section className="hero-panel glass glow-border">
        <div className="pill">Project Hub</div>
        <h1 className="hero-title">
          Launch, discover, and chat with your projects in one elegant home.
          <span className={`hero-accent ${pulse ? 'is-on' : ''}`}> 100% focused on students.</span>
        </h1>
        <p className="hero-subtitle">
          Showcase capstones and mini projects with cinematic previews, browse the community gallery,
          and let teammates interrogate PDFs with AI-powered chat.
        </p>

        <div className="cta-row">
          <Link to="/upload" className="primary-btn">Upload your project</Link>
          <Link to="/project" className="ghost-btn">Explore the gallery</Link>
        </div>

        <div className="hero-stats">
          <div className="stat glass">
            <span className="stat-number">Live</span>
            <p className="stat-label">Embeddings ready per PDF</p>
          </div>
          <div className="stat glass">
            <span className="stat-number">Multi</span>
            <p className="stat-label">Department-ready layouts</p>
          </div>
          <div className="stat glass">
            <span className="stat-number">AI</span>
            <p className="stat-label">Chat against your uploads</p>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card glass">
            <div className="feature-top">
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </div>
            <Link to={feature.to} className="feature-link">
              <span>{feature.action}</span>
              <span className="feature-dot" />
            </Link>
          </div>
        ))}
      </section>

      <section className="flow-panel glass">
        <div>
          <p className="pill">How it works</p>
          <h2 className="section-title">From upload to AI answers in three steps.</h2>
          <p className="section-subtitle">Bring your PDF once; share a searchable, chat-friendly profile forever.</p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.label} className="step-card">
              <div className="step-badge">{step.label}</div>
              <p className="step-copy">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-panel glass">
        <div>
          <h3 className="section-title">What is Project Hub?</h3>
          <p className="section-subtitle">
            A single destination to stage, browse, and interrogate student projects. Designed for fast showcase links,
            searchable cards, and AI conversations tied directly to each PDF.
          </p>
        </div>
        <div className="info-actions">
          <Link to="/upload" className="primary-btn">Start with an upload</Link>
          <Link to="/project" className="ghost-btn">See live examples</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;

