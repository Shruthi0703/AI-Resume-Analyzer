import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !subject || !message) {
      addToast('Please fill in all fields.', 'error');
      return;
    }

    setSending(true);
    // Simulate API contact trigger
    setTimeout(() => {
      setSending(false);
      addToast('Message sent successfully! We will get back to you shortly.', 'success');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div style={{ padding: '60px 0', animation: 'fadeIn 0.5s ease' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-card">
          <h1 style={{ fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={32} className="text-accent" style={{ color: 'var(--accent)' }} />
            Contact Support
          </h1>
          <p style={{ marginBottom: '32px' }}>Have questions or run into technical issues? Shoot us a message.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Your Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Account issue, API key advice"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Message Content</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Describe your issue or feedback in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '10px' }} disabled={sending}>
              {sending ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderLeftColor: 'white' }}></div>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
