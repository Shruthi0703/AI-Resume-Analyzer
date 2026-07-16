import React from 'react';
import { Info, Cpu, FileCheck } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '60px 0', animation: 'fadeIn 0.5s ease' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          <h1 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={32} className="text-accent" style={{ color: 'var(--accent)' }} />
            About ResumeAnalyzer
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            ResumeAnalyzer is a production-grade career optimization platform designed to give job seekers an edge in modern recruiting environments. Traditional Applicant Tracking Systems (ATS) reject up to 75% of resumes before they ever reach human eyes. Our engine is built to close that gap.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            By parsing resume content and comparing it against specified job descriptions, our platform analyzes missing skills, recommends study paths, proposes certifications, and drafts potential interview questions to ensure candidates are fully prepared.
          </p>
        </div>

        <div className="grid-cols-2">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ color: 'var(--accent)', background: 'var(--accent-light)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '8px' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Resume Intelligence Engine</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Powered by state-of-the-art Generative AI models. Provides rich, contextual feedback that goes beyond simple keyword counts.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '8px' }}>
              <FileCheck size={24} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Complete Data Safety</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Your files and descriptions are secured behind JWT authentication protocols. We only process data to compile your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
