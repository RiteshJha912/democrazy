import React from 'react';
import { Link } from 'react-router-dom';
import { LightBulbIcon, ShieldCheckIcon, GlobeAltIcon, UserGroupIcon, ArrowRightIcon, BeakerIcon } from '@heroicons/react/24/outline';
import '../styles/About.css';

const AboutPage = () => {
  return (
    <div className="landing-bg-container">
      <div className="about-container animate-fade-up">
        {/* Hero */}
        <div className="about-hero">
          <h1 className="about-title">Democracy, but make it crazy secure.</h1>
          <p className="about-subtitle">
            Welcome to Democrazy. It’s like a suggestion box, but nobody can throw the suggestions in the trash when you look away. 
            We put your opinions on the blockchain where they live forever, like that one embarrassing Facebook photo from 2011.
          </p>
        </div>

        {/* Core Features */}
        <div className="feature-section">
          
          <div className="feature-block">
            <div className="feature-icon-wrapper">
              <LightBulbIcon style={{ height: '32px' }} />
            </div>
            <h2 className="feature-title">Propel Proposals</h2>
            <p className="feature-desc">
              Got a burning question? "Chai vs Coffee"? "Virat vs Rohit"? Or just actual serious governance stuff?
              Spin up a new poll in seconds. You set the agenda, you define the options. 
              Once it's up, it's there for the whole community to debate.
            </p>
          </div>

          <div className="feature-block">
            <div className="feature-icon-wrapper">
              <ShieldCheckIcon style={{ height: '32px' }} />
            </div>
            <h2 className="feature-title">No "Bakwaas" Policy</h2>
            <p className="feature-desc">
              Decentralized doesn't mean "kachra allowed". We've built in a robust 
              <strong> Content Filtering System</strong> that automatically blocks NSFW and toxic terms.
              We keep the platform clean like your family WhatsApp group... actually, simpler than that. No aunties forwarding nonsense here.
            </p>
          </div>

          <div className="feature-block">
            <div className="feature-icon-wrapper">
              <UserGroupIcon style={{ height: '32px' }} />
            </div>
            <h2 className="feature-title">Ek Wallet, Ek Vote</h2>
            <p className="feature-desc">
              No bots, no rigging, no "chacha vidhayak hai hamare". Our smart contract ensures strictly ONE vote per wallet.
              The results you see aren't tweaked by some backend admin. It's the real, mathematically verified truth.
            </p>
          </div>

        </div>

        {/* Faucet & CTA Section */}
        <div className="faq-section">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>
              Grab some gas to start voting here
            </p>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem'}}>
            <a 
              href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="about-btn-base about-faucet-btn"
            >
              <BeakerIcon style={{height: '24px'}} />
              Grab Free Sepolia ETH
            </a>
            

          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
