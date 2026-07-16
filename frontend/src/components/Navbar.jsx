import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User, Upload, LayoutDashboard, Info, Mail, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? 'var(--accent)' : 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: isActive(path) ? '700' : '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    background: isActive(path) ? 'var(--accent-light)' : 'transparent',
    border: '1px solid',
    borderColor: isActive(path) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
  });

  return (
    <nav className="glass-nav" style={{ padding: '12px 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            RA
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Resume<span className="gradient-text" style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intel</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Navigation Links */}
          {user ? (
            <>
              <Link to="/dashboard" style={linkStyle('/dashboard')}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/upload" style={linkStyle('/upload')}>
                <Upload size={18} />
                Analyze
              </Link>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle('/')}>
                Home
              </Link>
              <Link to="/about" style={linkStyle('/about')}>
                <Info size={18} />
                About
              </Link>
              <Link to="/contact" style={linkStyle('/contact')}>
                <Mail size={18} />
                Contact
              </Link>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'var(--accent-light)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(99, 102, 241, 0.15)'
            }}
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Section / Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="btn btn-secondary"
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '0.9rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  borderRadius: '10px'
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--gradient-primary)', 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'User'}
                </span>
                <ChevronDown size={14} style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    onClick={() => setShowProfileMenu(false)} 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                  />
                  <div 
                    className="glass-card" 
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '200px',
                      padding: '8px',
                      zIndex: 100,
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      borderRadius: '12px'
                    }}
                  >
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--accent-light)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-card)', margin: '4px 0' }} />
                    
                    <button 
                      onClick={handleLogout}
                      style={{
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        width: '100%',
                        color: 'var(--danger)',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '10px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '10px' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
