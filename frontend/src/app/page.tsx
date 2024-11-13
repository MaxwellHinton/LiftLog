"use client";
import React, { useEffect, useState } from 'react';
import './homepage.css';

const HomePage = () => {
  // main text 
  const [text, setText] = useState('');
  const fullText = "Smash your fitness goals with LiftLog. Your personalized gym tracking application.";

  // drop down menu
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => { // repeats the lambda function () => a certain amount of times
      setText(fullText.slice(0, index));
      index++;

      if(index > fullText.length){
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-container">
      
      <section id="home" className="section">

      <div className="logo-header">
        <h1 className="logo-text">Lift<br />Log.</h1>

        <div className={`nav-menu ${showMenu ? 'show' : ''}`}>
          <a href="#home" className="nav-menu-items">Home</a>
          <a href="#about" className="nav-menu-items">About</a>
          <a href="#signup" className="nav-menu-items">Signup</a>
          <a href="#contact" className="nav-menu-items">Contact</a>
        </div>

        <button className="menu-button" onClick={handleMenuClick}>
          <img src="/icons/64x64/menu.png" alt="Menu" />
        </button>
      </div>


        <div className="middle-container">
          <main className="text-center">
            <p className="main-text">{text}</p>

          </main>
        </div>

        <div className="scrollDownIndicator">
          <img
            src="/icons/64x64/chevron.png"
            alt="Scroll down"
            className="scroll-icon"
          />
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
      </section>

      <section id="about" className="section about-section">
        <a href="#about"></a>
        <h2>What is LiftLog?</h2>
        <p>LiftLog is your ultimate gym tracking companion, designed to help you set and achieve fitness goals with ease. Track workouts, log progress, and stay motivated on your journey!</p>
      </section>

      <section id="signup" className="section signup-section">
      <a href="#signup"></a>
        <h2>Signup</h2>
        <p>Join LiftLog today to start tracking your gym progress. Sign up and get personalized insights and motivation to hit your fitness milestones.</p>
        <button className="signup-button">Sign Up Now</button>
      </section>

      <section id="contact" className="section contact-section">
        <a href="#contact"></a>
        <h2>Contact Me</h2>
        <p>If you have questions or would like to know more about LiftLog, feel free to reach out!</p>
        <div className="contact-info">
          <a href="mailto:your-email@example.com">your-email@example.com</a>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
