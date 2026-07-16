import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, Cpu, Award, BookOpen, CheckCircle, Shield } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '60px 0', animation: 'fadeIn 0.6s ease' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            Next-Gen AI Technology
          </span>
          <h1 style={{ fontSize: '3.6rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Land Your Dream Job With <br />
            <span className="gradient-text">AI-Powered</span> Analysis
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            Compare your resume against any job description. Get instant match scores, detect missing skills, generate customized learning roadmaps, and practice targeted interview questions.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {user ? (
              <Link to="/upload" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                <Upload size={20} />
                Analyze Your Resume Now
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', fontWeight: 800 }}>
            Features Designed for Career Growth
          </h2>
          <div className="grid-cols-3">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--accent)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontWeight: 700 }}>AI Match Score</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Instant fit analysis of your resume text against specific job requirements using our advanced Resume Intelligence Engine.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--success)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontWeight: 700 }}>Skill Deficit Analysis</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Clearly highlights matching capabilities and lists exact missing technical skills required to pass applicant screening systems.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--warning)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontWeight: 700 }}>Roadmap & Prep</h3>
              <p style={{ fontSize: '0.95rem' }}>
                Generates interactive study roadmaps, recommended certifications, and custom interview questions tailored to bridge your gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Stats Panel */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid var(--border-card)',
          padding: '40px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>98%</div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>ATS Optimization Rate</p>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'var(--border-card)', display: 'inline-block' }}></div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>2.5x</div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Interview Call Increase</p>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'var(--border-card)', display: 'inline-block' }}></div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>&lt; 5s</div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analysis Processing Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
