import React, { useState, useEffect } from 'react';

export default function GlobalLaunchOverlay({ onComplete }) {
  const [codeLines, setCodeLines] = useState([]);
  const [phase, setPhase] = useState('coding'); // 'coding' | 'deploying' | 'reveal'
  
  const snippets = [
    "import { db } from './firebase/config';",
    "const initializeApp = async () => {",
    "  await connectToServer('wss://mainframe.rudraksha.dev');",
    "  console.log('Mainframe connection established.');",
    "  const assets = await preloadAssets(['hd_images', '3d_models', 'fonts']);",
    "  if (assets.status !== 200) throw new Error('Asset fail');",
    "  compileStyles({ theme: 'dark_premium', animations: 'fluid' });",
    "  mountReactNode(document.getElementById('root'));",
    "}",
    "/* Compiling core modules... */",
    "export const StudioContext = createContext();",
    "function bootstrap() {",
    "  verifyAdminSignatures();",
    "  startGlobalBroadcast('RUDRAKSHA_LIVE');",
    "}",
    "// DEPLOYING TO PRODUCTION...",
    "await deploy();"
  ];

  useEffect(() => {
    // Phase 1: Rapid coding
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < snippets.length) {
        setCodeLines(prev => [...prev, snippets[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('deploying'), 1000);
      }
    }, 400); // Takes about 7 seconds to code

    // Phase 2: Deploying after 8 seconds
    const deployTimer = setTimeout(() => {
      setPhase('deploying');
    }, 8500);

    // Phase 3: Reveal after 15 seconds
    const revealTimer = setTimeout(() => {
      setPhase('reveal');
    }, 16000);

    // End after 20 seconds
    const endTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(deployTimer);
      clearTimeout(revealTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#020617', zIndex: 9999999, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Fira Code', 'Courier New', monospace",
      animation: phase === 'reveal' ? 'fadeOutOverlay 1.5s 2.5s forwards' : 'none'
    }}>
      
      {/* PHASE 1 & 2: HACKER TERMINAL */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        padding: '2rem', boxSizing: 'border-box',
        display: phase === 'reveal' ? 'none' : 'block',
        color: '#10b981', fontSize: '1.2rem', lineHeight: '1.6',
        textShadow: '0 0 5px rgba(16, 185, 129, 0.5)'
      }}>
        {codeLines.map((line, i) => (
          <div key={i} style={{ animation: 'typeLine 0.1s ease-out' }}>
             <span style={{ color: '#64748b', marginRight: '1rem' }}>{String(i+1).padStart(2, '0')}</span>
             {line}
          </div>
        ))}
        {currentLine !== snippets.length && <div className="blink-cursor" style={{ display: 'inline-block', width: '10px', height: '1.2rem', background: '#10b981', marginTop: '5px' }} />}
      </div>

      {/* PHASE 2: DEPLOY PROGRESS */}
      {phase === 'deploying' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', maxWidth: '90%', background: 'rgba(15, 23, 42, 0.9)',
          padding: '3rem', borderRadius: '16px', border: '1px solid #10b981',
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)', textAlign: 'center',
          animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
           <h2 style={{ color: 'white', fontSize: '2rem', margin: '0 0 2rem', letterSpacing: '0.2em' }}>EXECUTING LAUNCH</h2>
           
           <div className="system-log" style={{ textAlign: 'left', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '2rem' }}>
               <div style={{ animation: 'fadeUp 0.3s 0.2s both' }}>{'>'} Synchronizing databases... [DONE]</div>
               <div style={{ animation: 'fadeUp 0.3s 1.0s both' }}>{'>'} Compiling 3D render engine... [DONE]</div>
               <div style={{ animation: 'fadeUp 0.3s 1.8s both' }}>{'>'} Generating global SSL certificates... [DONE]</div>
               <div style={{ animation: 'fadeUp 0.3s 2.6s both' }}>{'>'} Pushing to Edge Network... [IN PROGRESS]</div>
               <div style={{ animation: 'fadeUp 0.3s 4.0s both', color: '#fef08a', fontWeight: 'bold' }}>{'>'} ALL SYSTEMS GO. GOING LIVE.</div>
           </div>

           <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', animation: 'hackerProgress 7.5s cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards' }} />
           </div>
        </div>
      )}

      {/* PHASE 3: GRAND REVEAL */}
      {phase === 'reveal' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'flashWhite 2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
        }}>
           <div className="reveal-logo" style={{ textAlign: 'center' }}>
              <h1 style={{ 
                fontSize: '5vw', margin: 0, 
                background: 'linear-gradient(to right, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '0.3em', textTransform: 'uppercase', textShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
                animation: 'scaleUpTitle 2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
              }}>
                RUDRAKSHA ONLINE
              </h1>
              <p style={{ color: 'white', marginTop: '2rem', fontSize: '1.5rem', letterSpacing: '0.5em', animation: 'fadeInUp 1s 1s both' }}>
                WELCOME TO THE FUTURE
              </p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes typeLine { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .blink-cursor { animation: blink-cursor 1s step-end infinite; }
        
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, -40%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hackerProgress { 0% { width: 0%; } 20% { width: 30%; } 40% { width: 45%; } 60% { width: 80%; } 100% { width: 100%; } }
        
        @keyframes flashWhite { 
          0% { background: white; opacity: 1; } 
          10% { background: #050505; opacity: 1; }
          100% { background: #050505; opacity: 1; }
        }
        @keyframes scaleUpTitle { 
          from { transform: scale(0.8); opacity: 0; filter: blur(10px); } 
          to { transform: scale(1); opacity: 1; filter: blur(0px); } 
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); letterSpacing: '0.2em'; } to { opacity: 1; transform: translateY(0); letterSpacing: '0.5em'; } }
        @keyframes fadeOutOverlay { to { opacity: 0; visibility: hidden; pointer-events: none; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}
