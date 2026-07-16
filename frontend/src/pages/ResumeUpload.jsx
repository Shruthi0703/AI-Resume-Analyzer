import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Upload, FileText, AlertTriangle, ChevronRight, Check, Cpu, RefreshCw, BarChart2 } from 'lucide-react';

const ResumeUpload = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorDetails, setErrorDetails] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  const loadingMessages = [
    "Analyzing your resume...",
    "Comparing with job description...",
    "Calculating ATS score...",
    "Identifying missing skills...",
    "Generating AI suggestions...",
    "Preparing career roadmap...",
    "Almost done..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      addToast('Only PDF and DOCX files are supported.', 'error');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setErrorDetails(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please upload a resume file', 'error');
      return;
    }
    if (!jobDescription.trim()) {
      addToast('Please provide a job description', 'error');
      return;
    }

    setLoading(true);
    setErrorDetails(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    formData.append('userEmail', user.email);

    try {
      const response = await axios.post('http://localhost:8080/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      addToast('Resume analyzed successfully!', 'success');
      navigate(`/analysis/${response.data.id}`);

    } catch (err) {
      setLoading(false);
      console.error(err);
      const serverResponse = err.response?.data;
      if (serverResponse && serverResponse.errorType === 'INVALID_GEMINI_KEY') {
        setErrorDetails({
          title: 'AI Engine API Key Issue',
          message: serverResponse.message,
          solution: 'Please configure a valid OpenRouter API Key in the backend application.properties file under openrouter.api.key, or set it as a GEMINI_API_KEY environment variable.'
        });
        addToast('AI Engine API key is invalid or not configured.', 'error');
      } else {
        setErrorDetails({
          title: 'Analysis Failed',
          message: serverResponse?.message || err.message || 'An error occurred during resume analysis.',
          solution: 'Ensure the backend server is running, the database connection is healthy, and the file is not corrupted.'
        });
        addToast('Failed to analyze resume.', 'error');
      }
    }
  };

  return (
    <div style={{ padding: '40px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
          Analyze Your Resume
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '40px' }}>
          Upload your resume and paste the target job description to get a comprehensive gap analysis.
        </p>

        {errorDetails && (
          <div className="glass-card animate-slide-up" style={{ 
            borderColor: 'var(--danger)', 
            background: 'rgba(239, 68, 68, 0.05)', 
            marginBottom: '30px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}>
            <div style={{ color: 'var(--danger)', padding: '4px' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '6px' }}>{errorDetails.title}</h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{errorDetails.message}</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(239, 68, 68, 0.1)', paddingTop: '10px' }}>
                <strong>Recommendation:</strong> {errorDetails.solution}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '60px 40px', minHeight: '380px' }}>
            {/* Animated AI logo */}
            <div className="flex-center" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 36px auto' }}>
              <div className="ai-pulse-ring"></div>
              <div className="ai-pulse-ring"></div>
              <div className="ai-pulse-ring"></div>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--gradient-primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                zIndex: 2
              }}>
                <Cpu size={40} className="spinner" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            
            <h2 style={{ marginBottom: '12px', fontWeight: 800, minHeight: '34px' }} className="gradient-text">
              {loadingMessages[loadingMessageIndex]}
            </h2>
            <p style={{ maxWidth: '460px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              The Resume Intelligence Engine is evaluating core skills, calculating matching statistics, and formulating professional ATS recommendations. Please do not close this window.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* File Upload Area */}
            <div className="form-group">
              <label className="form-label">1. Upload Resume (PDF or DOCX)</label>
              
              <div 
                className="flex-center"
                style={{
                  border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-card)'}`,
                  background: dragActive ? 'var(--accent-light)' : 'var(--bg-primary)',
                  padding: '40px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'center'
                }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                
                <div style={{ color: file ? 'var(--success)' : 'var(--accent)', background: file ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent-light)', padding: '16px', borderRadius: '50%', transition: 'all 0.3s' }}>
                  {file ? <Check size={32} /> : <Upload size={32} />}
                </div>
                
                {file ? (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--success)', marginBottom: '4px' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Click or drag to replace
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                      Drag and drop your file here
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Supports PDF and DOCX up to 10MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Area */}
            <div className="form-group">
              <label className="form-label">2. Paste Job Description</label>
              <textarea
                className="form-control"
                rows={9}
                placeholder="Paste the complete job description details, qualifications, and requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{ resize: 'vertical', minHeight: '180px' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '1.05rem' }}
            >
              Analyze Resume
              <ChevronRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
