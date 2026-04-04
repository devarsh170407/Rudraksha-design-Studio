import React, { useState, useEffect } from 'react';

export default function GlobalLaunchOverlay({ onComplete }) {
  const [codeLines, setCodeLines] = useState([]);
  const [phase, setPhase] = useState('coding'); // 'coding' | 'deploying' | 'rocket' | 'curtainsOpen'
  
  const snippets = [
    "import { globalMainframe } from './rudraksha/core';",
    "const initializeSystems = async () => {",
    "  await globalMainframe.connect('wss://secure.node');",
    "  console.log('Secure tunnel established.');",
    "  const assets = await preloadAssets(['ultra_hd_designs', '3d_models']);",
    "  compileStyles({ theme: 'dark_premium', animations: 'fluid' });",
    "  mountReactNode(document.getElementById('root'));",
    "}",
    "// Compiling final packages...",
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
    }, 450); 

    // Phase 2: Deploying
    const deployTimer = setTimeout(() => setPhase('deploying'), 8500);

    // Phase 3: Rocket Blastoff
    const rocketTimer = setTimeout(() => setPhase('rocket'), 14000);

    // Phase 4: Curtains Open
    const curtainsTimer = setTimeout(() => setPhase('curtainsOpen'), 17000);

    // End Component
    const endTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(deployTimer);
      clearTimeout(rocketTimer);
      clearTimeout(curtainsTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 9999999, overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* THE CURTAINS */}
      <div className={`curtain left-curtain ${phase === 'curtainsOpen' ? 'pull-left' : ''}`} />
      <div className={`curtain right-curtain ${phase === 'curtainsOpen' ? 'pull-right' : ''}`} />
      
      {/* SPOTLIGHTS */}
      <div className="spotlight spot-left" />
      <div className="spotlight spot-right" />

      {/* PHASE 1 & 2: HOLOGRAPHIC HACKER TERMINAL ON THE CURTAINS */}
      {(phase === 'coding' || phase === 'deploying') && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: '800px', height: '80%',
          background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px',
          padding: '2rem', boxSizing: 'border-box', zIndex: 60,
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.1)',
          animation: 'popInTerminal 0.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
        }}>
           
           <div style={{
             color: '#10b981', fontSize: '1.1rem', lineHeight: '1.6',
             fontFamily: "'Fira Code', 'Courier New', monospace", textShadow: '0 0 5px rgba(16, 185, 129, 0.5)'
           }}>
             {codeLines.map((line, i) => (
               <div key={i} style={{ animation: 'typeLine 0.1s ease-out' }}>
                  <span style={{ color: '#64748b', marginRight: '1rem' }}>{String(i+1).padStart(2, '0')}</span>
                  {line}
               </div>
             ))}
             {phase === 'coding' && <div className="blink-cursor" style={{ display: 'inline-block', width: '10px', height: '1.2rem', background: '#10b981', marginTop: '5px' }} />}
           </div>

           {/* PHASE 2: DEPLOY PROGRESS INSIDE TERMINAL */}
           {phase === 'deploying' && (
             <div style={{
               marginTop: '2rem', padding: '2rem', background: 'rgba(15, 23, 42, 0.9)',
               borderRadius: '12px', border: '1px solid #38bdf8',
               animation: 'fadeUp 0.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
             }}>
                <h2 style={{ color: 'white', fontSize: '1.5rem', margin: '0 0 1rem', letterSpacing: '0.2em', textAlign: 'center' }}>EXECUTING GLOBAL DEPLOYMENT</h2>
                <div style={{ fontFamily: "'Fira Code', 'Courier New', monospace", color: '#38bdf8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    <div style={{ animation: 'fadeUp 0.3s 0.2s both' }}>{'>'} Synchronizing databases... [DONE]</div>
                    <div style={{ animation: 'fadeUp 0.3s 1.0s both' }}>{'>'} Compiling 3D render engine... [DONE]</div>
                    <div style={{ animation: 'fadeUp 0.3s 1.8s both' }}>{'>'} Pushing to Edge Network... [IN PROGRESS]</div>
                    <div style={{ animation: 'fadeUp 0.3s 3.0s both', color: '#fef08a', fontWeight: 'bold' }}>{'>'} ALL SYSTEMS GO.</div>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                   <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981, #38bdf8)', animation: 'hackerProgress 5s cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards' }} />
                </div>
             </div>
           )}
        </div>
      )}

      {/* PHASE 3 & 4: ROCKET BLASTOFF ON STAGE */}
      {(phase === 'rocket' || phase === 'curtainsOpen') && (
        <div className="stage-content" style={{ position: 'relative', zIndex: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          
          <div className="launch-rocket-container" style={{ opacity: phase === 'rocket' ? 1 : 0, transition: 'opacity 0.5s' }}>
             <span className="rocket-emoji" style={{ display: 'inline-block', filter: 'drop-shadow(0 20px 30px rgba(239,68,68,0.6))' }}>🚀</span>
          </div>

          <h1 className="grand-launch-title" style={{ opacity: phase === 'rocket' ? 1 : 0, transition: 'opacity 2s' }}>READY TO INSPIRE</h1>
          <p className="grand-launch-subtitle" style={{ opacity: phase === 'rocket' ? 1 : 0, transition: 'opacity 2s' }}>Deploying Rudraksha Design Studio</p>

        </div>
      )}

      <style>{`
        .curtain {
          position: absolute;
          top: 0;
          width: 50vw;
          height: 100vh;
          background: linear-gradient(90deg, #500 0%, #a00 20%, #700 40%, #c00 60%, #800 80%, #400 100%);
          background-size: 100px 100%;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.8);
          z-index: 50;
        }
        .left-curtain { left: 0; transform-origin: left top; border-right: 5px solid #200; box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
        .right-curtain { right: 0; transform-origin: right top; border-left: 5px solid #200; box-shadow: -10px 0 30px rgba(0,0,0,0.5); }

        .pull-left { animation: pullCurtainLeft 3s forwards cubic-bezier(0.8, 0, 0.2, 1); }
        .pull-right { animation: pullCurtainRight 3s forwards cubic-bezier(0.8, 0, 0.2, 1); }

        @keyframes pullCurtainLeft { 0% { transform: scaleX(1); } 100% { transform: scaleX(0); opacity: 0; } }
        @keyframes pullCurtainRight { 0% { transform: scaleX(1); } 100% { transform: scaleX(0); opacity: 0; } }

        .spotlight {
          position: absolute;
          top: -50px;
          width: 300px;
          height: 150vh;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          z-index: 55;
          opacity: 0;
          pointer-events: none;
        }
        .spot-left { left: 10%; transform-origin: top center; animation: spotlightsOn 1s 1s forwards, sweepLeft 8s infinite alternate ease-in-out; }
        .spot-right { right: 10%; transform-origin: top center; animation: spotlightsOn 1s 1s forwards, sweepRight 8s infinite alternate ease-in-out; }

        @keyframes spotlightsOn { to { opacity: 1; } }
        @keyframes sweepLeft { 0% { transform: rotate(15deg); } 100% { transform: rotate(35deg); } }
        @keyframes sweepRight { 0% { transform: rotate(-15deg); } 100% { transform: rotate(-35deg); } }

        @keyframes popInTerminal { from { opacity: 0; transform: translate(-50%, -40%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes typeLine { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hackerProgress { 0% { width: 0%; } 20% { width: 30%; } 40% { width: 45%; } 60% { width: 80%; } 100% { width: 100%; } }
        @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .blink-cursor { animation: blink-cursor 1s step-end infinite; }

        .launch-rocket-container { margin-bottom: 2rem; animation: rocketEntry 1s forwards cubic-bezier(0.1, 0.8, 0.2, 1); }
        .rocket-emoji { font-size: 8rem; animation: rocketShake 0.1s infinite, rocketBlastOff 2.5s 1s forwards cubic-bezier(0.6, -0.28, 0.735, 0.045); }

        @keyframes rocketEntry { from { transform: translateY(100px) scale(0.5); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes rocketShake { 0% { transform: translate(1px, 1px) rotate(0deg); } 50% { transform: translate(-1px, -2px) rotate(-1deg); } 100% { transform: translate(-3px, 0px) rotate(1deg); } }
        @keyframes rocketBlastOff { 0% { transform: translateY(0) scale(1); } 30% { transform: translateY(50px) scale(0.9); } 100% { transform: translateY(-2000px) scale(2); opacity: 0; } }

        .grand-launch-title {
          font-size: 4rem;
          background: linear-gradient(to right, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          animation: fadeInScale 1.5s forwards;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
        }
        .grand-launch-subtitle { color: #cbd5e1; font-size: 1.4rem; margin-top: 1rem; animation: fadeInScale 1.5s 0.5s forwards both; font-weight: 300; }
        
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
