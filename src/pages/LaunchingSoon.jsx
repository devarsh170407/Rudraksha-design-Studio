import React from 'react';

const LaunchingSoon = () => {
  return (
    <div className="launching-soon-container">
      <div className="overlay"></div>
      <div className="content">
        <img src="/logomain.png" alt="Rudraksha Design Studio Logo" className="logo-img" />
        <h1 className="logo-text">Rudraksha Design Studio</h1>
        <div className="divider"></div>
        <h2 className="main-title">Crafting Excellence</h2>
        <p className="subtitle">
          Something extraordinary is breathing into life. Our new digital experience is launching soon.
        </p>
        <div className="status-badge">
          <span>Launching Soon</span>
        </div>
        
        <div className="contact-info">
            <p>WhatsApp: +91 98983 84133</p>
        </div>
      </div>
      
      <style jsx>{`
        .launching-soon-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/assets/launching_bg.png') no-repeat center center/cover;
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          pointer-events: none;
        }

        .content {
          position: relative;
          text-align: center;
          z-index: 10;
          padding: 2rem;
          max-width: 800px;
          animation: fadeIn 1.5s ease-out;
        }

        .logo-img {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
        }

        .logo-text {
          font-size: 1.2rem;
          letter-spacing: 0.3rem;
          text-transform: uppercase;
          margin-bottom: 2rem;
          font-weight: 400;
          color: #e2e8f0;
        }

        .divider {
          width: 60px;
          height: 2px;
          background: #3b82f6;
          margin: 0 auto 2rem;
        }

        .main-title {
          font-size: clamp(3rem, 10vw, 5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          background: linear-gradient(to bottom, #ffffff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .status-badge {
          display: inline-block;
          padding: 1rem 2.5rem;
          border: 2px solid rgba(59, 130, 246, 0.6);
          border-radius: 100px;
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          margin-bottom: 4rem;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
        }

        .contact-info {
            margin-top: 2rem;
            color: #64748b;
            font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LaunchingSoon;
