import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate passwords match on Sign Up
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      // Admin shortcut — hidden
      if (email === 'admin@gmail.com' && password === '123456') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch {
          await createUserWithEmailAndPassword(auth, email, password);
        }
        navigate('/admin');
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save additional user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          phone: phone,
          createdAt: new Date().toISOString(),
          role: 'user'
        });
      }
      setConfirmPassword('');
      setPhone('');
      navigate('/projects');
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please sign in.';
      if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '2rem 1rem',
    }}>
      {/* ── Outer Card (split layout) ── */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '860px',
        minHeight: '520px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>

        {/* ───── LEFT: Photo + Quote ───── */}
        <div style={{
          flex: '0 0 48%',
          position: 'relative',
          backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem',
        }}>
          {/* Dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(5,5,30,0.88) 0%, rgba(10,20,60,0.72) 50%, rgba(0,0,0,0.55) 100%)',
          }} />

          {/* Studio branding — top */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem', color: 'white'
              }}>R</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', lineHeight: 1 }}>RUDRAKSHA</div>
                <div style={{ color: '#d4af37', fontSize: '0.6rem', letterSpacing: '0.14em' }}>DESIGN STUDIO</div>
              </div>
            </div>
          </div>

          {/* Quote block — bottom */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '30px', height: '2.5px', background: '#d4af37', borderRadius: '2px' }} />
              <span style={{ color: '#d4af37', fontSize: '0.62rem', letterSpacing: '0.14em', fontWeight: 600 }}>
                DESIGN PHILOSOPHY
              </span>
            </div>

            <div style={{ fontSize: '3rem', lineHeight: 0.7, color: '#2563eb', fontFamily: 'Georgia, serif', marginBottom: '0.6rem', opacity: 0.7 }}>
              "
            </div>

            <p style={{
              color: 'white',
              fontSize: '1.05rem',
              fontWeight: 400,
              lineHeight: 1.55,
              fontStyle: 'italic',
              marginBottom: '0.85rem',
              maxWidth: '300px'
            }}>
              Design is not just what it looks like and feels like. Design is how it works.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '24px', height: '1.5px', background: 'rgba(255,255,255,0.35)' }} />
              <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>— Steve Jobs</span>
            </div>
          </div>
        </div>

        {/* ───── RIGHT: Form ───── */}
        <div style={{
          flex: '1',
          background: '#0f0f1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2.5rem 2.25rem',
        }}>
          {/* Heading */}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', marginBottom: '0.3rem' }}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            {isLogin ? 'Sign in to your account to continue' : 'Create your Design Studio account'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
              borderRadius: '8px',
              marginBottom: '1.15rem',
              fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Phone Number — only on Sign Up */}
            {!isLogin && (
              <div>
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'white',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      borderRadius: '9px',
                      fontSize: '0.88rem',
                      outline: 'none',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'white',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    borderRadius: '9px',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: "'Outfit', sans-serif",
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.03em' }}>
                  Password
                </label>
                {isLogin && (
                  <button type="button" style={{ color: '#2563eb', fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'white',
                    padding: '0.75rem 2.6rem 0.75rem 2.4rem',
                    borderRadius: '9px',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: "'Outfit', sans-serif",
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717a', display: 'flex', alignItems: 'center',
                    background: 'none', border: 'none', cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — only on Sign Up */}
            {!isLogin && (
              <div>
                <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 500, marginBottom: '0.4rem', letterSpacing: '0.03em' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: confirmPassword && confirmPassword !== password
                        ? 'rgba(239,68,68,0.07)'
                        : confirmPassword && confirmPassword === password
                        ? 'rgba(34,197,94,0.07)'
                        : 'rgba(255,255,255,0.04)',
                      border: confirmPassword && confirmPassword !== password
                        ? '1px solid rgba(239,68,68,0.5)'
                        : confirmPassword && confirmPassword === password
                        ? '1px solid rgba(34,197,94,0.5)'
                        : '1px solid rgba(255,255,255,0.09)',
                      color: 'white',
                      padding: '0.75rem 2.6rem 0.75rem 2.4rem',
                      borderRadius: '9px',
                      fontSize: '0.88rem',
                      outline: 'none',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(s => !s)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: '0.85rem', top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#71717a', display: 'flex', alignItems: 'center',
                      background: 'none', border: 'none', cursor: 'pointer'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Live match indicator */}
                {confirmPassword && (
                  <p style={{
                    fontSize: '0.72rem',
                    marginTop: '0.35rem',
                    color: confirmPassword === password ? '#22c55e' : '#ef4444'
                  }}>
                    {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.4rem',
                padding: '0.82rem',
                background: loading ? '#374151' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                color: 'white', border: 'none', borderRadius: '9px',
                fontSize: '0.92rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Outfit', sans-serif",
                boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.5)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.35)'; }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle */}
          <p style={{ marginTop: '1.25rem', textAlign: 'center', color: '#71717a', fontSize: '0.82rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(v => !v); setError(''); }}
              style={{
                color: '#d4af37', fontWeight: 600,
                fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem',
                textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
