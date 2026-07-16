import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldAlert, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '60px 0', animation: 'fadeIn 0.5s ease' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="flex-center" style={{ margin: '0 auto 24px auto', background: 'var(--accent-light)', color: 'var(--accent)', width: '80px', height: '80px', borderRadius: '50%' }}>
            <User size={40} />
          </div>
          
          <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>User Profile</h2>
          <p style={{ marginBottom: '32px' }}>Manage your account settings and history</p>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NAME</div>
                <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontWeight: 600 }}>{user?.email || 'N/A'}</div>
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-primary)', border: '1px solid var(--border-card)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={18} className="text-muted" style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE</div>
                <div style={{ fontWeight: 600 }}>Standard User (Free Tier)</div>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', padding: '12px', borderColor: 'var(--danger)', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
            <LogOut size={18} />
            Logout from Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
