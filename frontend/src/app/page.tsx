import React from 'react';
import './homepage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <img
        src="/icons/background/backgroundFrame.png"
        alt="Homepage Background"
        className="homepage-background"
      />

      <div className="logo-header">
        <h1 className="logo-text">Lift<br />Log.</h1>
        <button className="menu-button">
          <img src="/icons/64x64/menu.png" alt="Menu" />
        </button>
      </div>

      <div className="middle-container">
        <main className="text-center">
          <p className="main-text">Smash your fitness goals with LiftLog.
            <br />Your personalized gym tracking application.</p>

          <div className="scrollDownIndicator">
            <img
              src="/icons/64x64/chevron.png"
              alt="Scroll down"
              className="scroll-icon"
            />
          </div>

        </main>
      </div>  
      <div className="contact-footer-container">
        <footer className="contact-footer">
          <p className="creator-text">Created by Maxwell Hinton</p>
          <div className="icon-links">
            <a
              href="https://github.com/MaxwellHinton"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/other/github-mark.png" alt="GitHub" className="social-icon" />
            </a>
            <a
              href="https://www.linkedin.com/in/maxwell-hinton-3489702b7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/other/LI-In-Bug.png" alt="LinkedIn" className="social-icon" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
