import React from 'react';
import './styles/LoginShowcase.css';
import doordashLogo from '../assets/doordash.png';
import ubereatsLogo from '../assets/ubereats.png';
import grubhubLogo from '../assets/grubhub.png';

const LoginShowcase = () => {
  return (
    <div className="LoginShowcase">
        <h3>Sync orders from:</h3>
        <div className="PlatformLogos">
            <img src={doordashLogo} alt="DoorDash" loading="lazy" />
            <img src={ubereatsLogo} alt="Uber Eats" loading="lazy" />
            <img src={grubhubLogo} alt="Grubhub" loading="lazy" />
        </div>
    <p>One dashboard to manage them all 🍽️</p>
    </div>
  );
};

export default LoginShowcase;
