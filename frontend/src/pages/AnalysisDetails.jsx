import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, Download, CheckCircle, AlertCircle, ListChecks, BookOpen, HelpCircle, Briefcase, Award, Cpu } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

const AnalysisDetails = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/resume/details/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      addToast('Failed to load analysis details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!analysis) return;
    try {
      addToast('Generating PDF Report...', 'info');
      const response = await API.get(`/api/resume/download/${id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_analysis_${analysis.resumeName.replace(/\.[^/.]+$/, "")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      addToast('Failed to download PDF report.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <div className="flex-center" style={{ position: 'relative', width: '90px', height: '90px' }}>
          <div className="ai-pulse-ring"></div>
          <div className="ai-pulse-ring"></div>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'var(--gradient-primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
            zIndex: 2
          }}>
            <Cpu size={30} className="spinner" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Retrieving AI Engine analysis report...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Analysis Report Not Found</h2>
        <p style={{ marginBottom: '24px' }}>The analysis you are looking for does not exist or has been deleted.</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  // Format list items
  const formatList = (str) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Convert suggestions/roadmap paragraphs into bullet items
  const formatTextToBullets = (text) => {
    if (!text) return [];
    return text.split('\n')
      .map(line => line.replace(/^-\s*/, '').replace(/^\*\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  const matchingSkills = formatList(analysis.matchingSkills);
  const missingSkills = formatList(analysis.missingSkills);
  const suggestions = formatTextToBullets(analysis.aiSuggestions);
  const roadmapItems = formatTextToBullets(analysis.learningRoadmap);
  const careerPaths = formatTextToBullets(analysis.careerRecommendations);
  const interviewQs = formatTextToBullets(analysis.interviewQuestions);
  const certs = formatTextToBullets(analysis.certificationRecommendations);

  // Generate ATS Score as a slightly lower score if skills are missing, or map directly
  const atsScore = Math.max(10, analysis.resumeScore);

  return (
    <div style={{ padding: '40px 0' }} className="animate-fade-in">
      <div className="container">
        {/* Navigation / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>
            <ChevronLeft size={18} />
            Back to Dashboard
          </Link>
          <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Download size={18} />
            Download PDF Report
          </button>
        </div>

        {/* Overview Box */}
        <div className="glass-card animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '40px', alignItems: 'center', marginBottom: '40px' }}>
          <div className="flex-center" style={{ flexDirection: 'column', gap: '12px' }}>
            <ScoreGauge score={analysis.resumeScore} size={160} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Ranking</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>
                {analysis.resumeScore >= 80 ? 'Excellent Match' : (analysis.resumeScore >= 50 ? 'Good Potential' : 'Needs Optimization')}
              </div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resume Intelligence Analysis
            </span>
            <h2 style={{ fontWeight: 800, marginTop: '4px', marginBottom: '12px', fontSize: '2.1rem' }}>
              {analysis.resumeName}
            </h2>
            <p style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
              This detailed ATS report compiles feedback from our AI Engine, checking your resume syntax and structure against the target job requirements.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <div style={{ padding: '8px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                <strong>Matching Skills:</strong> {matchingSkills.length} identified
              </div>
              <div style={{ padding: '8px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} style={{ color: 'var(--danger)' }} />
                <strong>Missing Skills:</strong> {missingSkills.length} gaps detected
              </div>
            </div>
          </div>
        </div>

        {/* Skills Comparison */}
        <div className="grid-cols-2 animate-slide-up" style={{ marginBottom: '40px', animationDelay: '0.1s' }}>
          {/* Matching Skills Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <CheckCircle size={20} className="text-success" style={{ color: 'var(--success)' }} />
              Matching Skills
            </h3>
            {matchingSkills.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>No explicitly matching skills identified.</p>
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {matchingSkills.map((skill, idx) => (
                  <span key={idx} className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <AlertCircle size={20} className="text-danger" style={{ color: 'var(--danger)' }} />
              Missing Skills
            </h3>
            {missingSkills.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--success)' }}>Excellent! No missing key skills detected.</p>
            ) : (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {missingSkills.map((skill, idx) => (
                  <span key={idx} className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Sections (Colorful Cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="animate-slide-up">
          
          {/* AI Suggestions Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <ListChecks size={22} style={{ color: '#6366f1' }} />
              AI Suggestions for Resume Improvement
            </h3>
            {suggestions.length === 0 ? (
              <p style={{ whiteSpace: 'pre-line' }}>{analysis.aiSuggestions}</p>
            ) : (
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {suggestions.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Learning Roadmap Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <BookOpen size={22} style={{ color: '#8b5cf6' }} />
              Learning Roadmap & Skill Acquisition
            </h3>
            {roadmapItems.length === 0 ? (
              <p style={{ whiteSpace: 'pre-line' }}>{analysis.learningRoadmap}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '14px' }}>
                {roadmapItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, paddingTop: '2px' }}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interview Questions Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <HelpCircle size={22} style={{ color: '#3b82f6' }} />
              Targeted Interview Questions
            </h3>
            {interviewQs.length === 0 ? (
              <p style={{ whiteSpace: 'pre-line' }}>{analysis.interviewQuestions}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {interviewQs.map((q, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Question {idx + 1}:</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>{q}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Career & Certifications Card */}
          <div className="grid-cols-2">
            <div className="glass-card" style={{ borderLeft: '4px solid #ec4899' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
                <Briefcase size={22} style={{ color: '#ec4899' }} />
                Career Recommendations
              </h3>
              {careerPaths.length === 0 ? (
                <p style={{ whiteSpace: 'pre-line' }}>{analysis.careerRecommendations}</p>
              ) : (
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {careerPaths.map((path, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{path}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
                <Award size={22} style={{ color: '#f59e0b' }} />
                Recommended Certifications
              </h3>
              {certs.length === 0 ? (
                <p style={{ whiteSpace: 'pre-line' }}>{analysis.certificationRecommendations}</p>
              ) : (
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {certs.map((c, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;
