import React from 'react';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png';
import hero_image from '../Assets/hero_image.png';
// import { motion } from 'framer-motion';
// import { fadeIn } from '../../variants';  // Go up two levels



const Hero = () => {
  return (
    <div className="Hero slide-in">
      <div
        // variants={fadeIn("up", 0.2)}
        // initial="hidden"
        // whileInView="show"
        // viewport={{ once: false, amount: 0.7 }}
        className="hero-left"
      >
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt="Hand Icon" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="Arrow Icon" />
        </div>
      </div>

      <div className="hero-right">
        <img src={hero_image} alt="Hero" />
      </div>
    </div>
  );
};

export default Hero;
