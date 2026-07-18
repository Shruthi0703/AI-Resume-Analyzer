import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Upload, FileText, Download, Eye, Calendar, Award, Database, TrendingUp, BarChart2, PieChart } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/resume/history', {
        params: { userEmail: user.email },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Sort history: newest first
      const sortedHistory = response.data.sort((a, b) => 
        new Date(b.uploadDate) - new Date(a.uploadDate)
      );
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
      addToast('Failed to load analysis history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchHistory();
    }
  }, [user]);

  const handleDownload = async (id, filename) => {
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
      link.setAttribute('download', `resume_analysis_${filename.replace(/\.[^/.]+$/, "")}.pdf`);
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
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner spinner-lg"></div>
        <p>Loading dashboard details...</p>
      </div>
    );
  }

  // Calculations
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.resumeScore, 0) / history.length) 
    : 0;

  const highestScore = history.length > 0 
    ? Math.max(...history.map(item => item.resumeScore)) 
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  // Skill matches distribution from history matching skills
  const skillCounts = {};
  history.forEach(item => {
    if (item.matchingSkills) {
      const skills = item.matchingSkills.split(',');
      skills.forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned) {
          skillCounts[cleaned] = (skillCounts[cleaned] || 0) + 1;
        }
      });
    }
  });

  const sortedSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topSkills = sortedSkills.slice(0, 3);

  const skillLabels = sortedSkills.map(entry => entry[0]);
  const skillValues = sortedSkills.map(entry => entry[1]);

  const pieChartData = {
    labels: skillLabels.length > 0 ? skillLabels : ['No Skills Yet'],
    datasets: [{
      label: 'Skills Frequency',
      data: skillValues.length > 0 ? skillValues : [1],
      backgroundColor: [
        'rgba(99, 102, 241, 0.75)',
        'rgba(124, 58, 237, 0.75)',
        'rgba(16, 185, 129, 0.75)',
        'rgba(245, 158, 11, 0.75)',
        'rgba(239, 68, 68, 0.75)'
      ],
      borderColor: 'var(--border-card)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'Outfit', size: 11 }
        }
      }
    }
  };

  const barChartData = {
    labels: [...history].reverse().slice(-8).map(item => item.resumeName.length > 12 ? item.resumeName.substring(0, 10) + '...' : item.resumeName),
    datasets: [{
      label: 'ATS Match Score (%)',
      data: [...history].reverse().slice(-8).map(item => item.resumeScore),
      backgroundColor: 'rgba(99, 102, 241, 0.75)',
      borderColor: 'var(--accent)',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(99, 102, 241, 0.05)' },
        ticks: { color: 'var(--text-secondary)', font: { family: 'Outfit' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-secondary)', font: { family: 'Outfit' } }
      }
    }
  };

  const strokeDashOffset = 440 - (440 * averageScore) / 100;

  return (
    <div style={{ padding: '40px 0' }} className="animate-fade-in">
      <div className="container">
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontWeight: 800, marginBottom: '6px' }}>
              Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
            </h1>
            <p>Track your resume analysis history and improvement roadmaps.</p>
          </div>
          <Link to="/upload" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Upload size={18} />
            Analyze New Resume
          </Link>
        </div>

        {history.length > 0 ? (
          <>
            {/* Stats Summary Grid */}
            <div className="grid-cols-3" style={{ marginBottom: '30px' }}>
              <div className="glass-card animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '16px', borderRadius: '12px' }}>
                  <Database size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Uploads</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{history.length}</div>
                </div>
              </div>

              <div className="glass-card animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '20px', animationDelay: '0.1s' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '16px', borderRadius: '12px' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: getScoreColor(averageScore) }}>{averageScore}%</div>
                </div>
              </div>

              <div className="glass-card animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '20px', animationDelay: '0.2s' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '16px', borderRadius: '12px' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highest Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: getScoreColor(highestScore) }}>{highestScore}%</div>
                </div>
              </div>
            </div>

            {/* Visual Analytics Row */}
            <div className="grid-cols-3" style={{ marginBottom: '45px' }}>
              {/* Score Gauge & Skills */}
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', alignSelf: 'flex-start' }}>Average Match Rate</h3>
                <div className="gauge-container" style={{ marginBottom: '20px' }}>
                  <svg className="gauge-svg" width="160" height="160" viewBox="0 0 160 160">
                    <circle className="gauge-bg" cx="80" cy="80" r="70" />
                    <circle 
                      className="gauge-value" 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      stroke={getScoreColor(averageScore)} 
                      strokeDasharray="440" 
                      strokeDashoffset={strokeDashOffset} 
                    />
                  </svg>
                  <div className="gauge-text">
                    <div className="gauge-score" style={{ color: getScoreColor(averageScore) }}>{averageScore}%</div>
                    <div className="gauge-label">ATS Rank</div>
                  </div>
                </div>
                <div style={{ width: '100%', borderTop: '1px solid var(--border-card)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Top Matching Keywords:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {topSkills.length > 0 ? (
                      topSkills.map(([skill]) => (
                        <span key={skill} className="badge badge-success" style={{ fontSize: '0.72rem' }}>{skill}</span>
                      ))
                    ) : (
                      <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>No skills scanned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={18} style={{ color: 'var(--accent)' }} />
                  Analysis Score Trend
                </h3>
                <div style={{ height: '220px', position: 'relative' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} style={{ color: 'var(--accent)' }} />
                  Matching Skills Density
                </h3>
                <div style={{ height: '220px', position: 'relative' }}>
                  <Pie data={pieChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* History / Table Section */}
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} className="text-accent" style={{ color: 'var(--accent)' }} />
            Analysis History
          </h2>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>You haven't uploaded any resumes yet. Start by analyzing your first resume!</p>
              <Link to="/upload" className="btn btn-primary">
                <Upload size={18} />
                Analyze First Resume
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-card)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Resume File</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Date Analyzed</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Match Score</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-card)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.resumeName}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} className="text-muted" />
                          {new Date(item.uploadDate).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge" style={{ 
                          backgroundColor: `${getScoreColor(item.resumeScore)}15`, 
                          color: getScoreColor(item.resumeScore),
                          fontSize: '0.85rem',
                          padding: '6px 12px'
                        }}>
                          {item.resumeScore}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <Link 
                            to={`/analysis/${item.id}`} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.85rem', gap: '4px' }}
                          >
                            <Eye size={14} />
                            View
                          </Link>
                          <button
                            onClick={() => handleDownload(item.id, item.resumeName)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem', gap: '4px', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}
                          >
                            <Download size={14} />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
