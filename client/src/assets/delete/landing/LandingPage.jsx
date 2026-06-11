import React from "react";
import "./Landing.css";

const LandingPage = () => (
  <div className="landing-container">
    <header className="landing-hero">
      {/* <a href="/"> */}
      <h1 className="landing-title">Welcome to Momma Nut</h1>
      {/* </a> */}
      <p className="landing-tagline">
        Discover delicious peanut products, recipes, and more!
      </p>
      <a href="/user-products" className="landing-cta">
        Explore Now
      </a>
    </header>
    <section className="landing-features">
      <div className="feature-card">
        <h2>Fresh Peanuts</h2>
        <p>Handpicked, roasted, and delivered to your door.</p>
      </div>
      <div className="feature-card">
        <h2>Nutty Recipes</h2>
        <p>Try our favorite peanut-inspired recipes for every occasion.</p>
      </div>
      <div className="feature-card">
        <h2>Healthy & Tasty</h2>
        <p>Enjoy snacks that are as nutritious as they are delicious.</p>
      </div>
    </section>
  </div>
);

export default LandingPage;