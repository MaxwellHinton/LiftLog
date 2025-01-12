"use client";
import React, { useEffect, useState } from 'react';
import './homepage.css';

const HomePage = () => {
  // main text 
  const [text, setText] = useState('');
  const fullText = "Smash your fitness goals with LiftLog. Your personalized gym tracking application.";
  const [isDarkerShadow, setIsDarkerShadow] = useState(false);

  // drop down menu
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  }

  // typing animation useEffect
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => { // repeats the lambda function () => a certain amount of times
      setText(fullText.slice(0, index));
      index++;

      if(index > fullText.length){
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // contact footer darker shadow use effect
  useEffect(() => {
    const homeSection = document.getElementById('home');
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDarkerShadow(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if(homeSection){
      observer.observe(homeSection);
    }

    return () => {
      if(homeSection) {
        observer.unobserve(homeSection);
      };
    };
  }, []);

  return (
    <div className="homepage-container">
      
      <section id="home" className="section">

      <div className="logo-header">
        <div className='logoNameImage'>
          <h1 className="logo-text">LiftLog.</h1>
          <img src='/icons/sections/muscle.png' className='logo-image'></img>

        </div>

        <div className={`nav-menu ${showMenu ? 'show' : ''}`}>
          <a href="#home" className="nav-menu-items">Home</a>
          <a href="#about" className="nav-menu-items">About</a>
          <a href="#features" className="nav-menu-items">Features</a>
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
          <footer className={`contact-footer ${isDarkerShadow? 'darker-shadow' : ''}`}>
            <p className="creator-text">Created by Maxwell Hinton</p>
            <div className="icon-links">
              <a
                href="https://github.com/MaxwellHinton"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/social/github-mark.png" alt="GitHub" className="social-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/maxwell-hinton-3489702b7"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/social/LI-In-Bug.png" alt="LinkedIn" className="social-icon" />
              </a>
            </div>
          </footer>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="content-section">
          <div className="text-container">
            <h2>About LiftLog</h2>
            <div className="header-line"></div>
            <p>Manage every part of your fitness journey. Set goals for machines. LiftLog provides a personalized approach to gym tracking, tailored to 
              your local gym. <br></br><br></br>
              <span style={{ fontWeight: 'bold', color: '#3d5ca5' }}>Featuring:</span></p>
              <ul>
                <li>Progress tracking</li>
                <li>Goal setting</li>
                <li>Interactive Gym map</li>
                <li>Leaderboards and local gym community engagement (in progress)</li>
              </ul>
          </div>
          <div className="image-container">
            <img src="/icons/sections/dumbbell.png" alt="About Icon" />
          </div>
        </div>
        <a href="#about"></a>
      </section>

      <section id="features" className="section signup-section">
        <div className="content-section">
          <div className="demo-image-container">
            <img src="/icons/appDemos/HOME MAP FINAL DEMO1.png" alt="Signup Icon" />
          </div>
          <div className="text-container">
            <h2>Interactive Map</h2>
            <div className="header-line"></div>
            <p>LiftLog features an interactive gym map that can be tailored to your 
              community gym. Click on machine icons to bring up more information and log your lifts.<br>
            </br></p>
          </div>
        </div>
        <a href="#features"></a>
      </section>

      <section id="demos" className="section demos-section">
        <div className="content-section">
          <div className="text-container">
            <h2>My Machines Tab</h2>
            <div className="header-line"></div>
            <p>Find all your favourite machines in one place!<br>
            </br></p>
          </div>
          <div className="demo-image-container">
            <img src="/icons/appDemos/MY MACHINE FINAL DEMO1.png"></img>
          </div>
        </div>
        <a href="#demos"></a>
      </section>

      <section id="contact" className="section contact-section">
        <div className="content-section">
          <div className="text-container">
            <h2>Contact Me</h2>
            <div className="header-line"></div>
            <p>For any enquiries, contact me at:</p>
            <div className="contact-info">
              <a href="mailto:maxhintonbusiness@gmail.com">maxhintonbusiness@gmail.com</a>
            </div>
          </div>
          <div className="image-container">
            <img src="/icons/sections/contact-book.png" alt="Contact Icon" />
          </div>
        </div>
        <a href="#contact"></a>
      </section>
    </div>
  );
};

export default HomePage;
