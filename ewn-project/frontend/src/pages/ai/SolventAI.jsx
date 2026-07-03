import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import { FiSend, FiCpu, FiUser, FiLock } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SolventAI = () => {
  const { user, setShowLoginModal } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [limitInfo, setLimitInfo] = useState(null);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('ewn_token');
      const res = await axios.post(
        `${API_URL}/ai/solvent-chat`,
        { message: text, history: nextMessages },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
      setLimitInfo({ remaining: res.data.remaining, limit: res.data.limit });
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 429 && data?.limitReached) {
        setError(data.message);
      } else if (err.response?.status === 401) {
        setError('Your session expired. Please log in again.');
      } else {
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logged-out state - Solvent AI is gated behind login, matching the
  // "only allow logged-in users" requirement.
  if (!user) {
    return (
      <div className="animate-slide-up">
        <SEO
          title="Solvent AI - Free AI Chat Assistant | EWN"
          description="Chat with Solvent AI, a free AI assistant that helps solve problems, answer questions, and think things through."
          path="/solvent-ai"
        />
        <div className="page-header">
          <h1 className="page-title">Solvent AI</h1>
          <p className="page-subtitle">Your problem-solving AI assistant. Free with a login.</p>
        </div>
        <div className="card" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--color-blue-light)', color: 'var(--color-blue)',
            width: '64px', height: '64px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '1.75rem',
          }}>
            <FiLock />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Log in to use Solvent AI</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Solvent AI is free, but requires a free account so we can keep it fast and reliable for everyone.
          </p>
          <button className="btn btn-primary" onClick={() => setShowLoginModal(true)}>
            Log in / Sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <SEO
        title="Solvent AI - Free AI Chat Assistant | EWN"
        description="Chat with Solvent AI, a free AI assistant that helps solve problems, answer questions, and think things through."
        path="/solvent-ai"
      />
      <div className="page-header" style={{ paddingBottom: '1rem' }}>
        <h1 className="page-title">Solvent AI</h1>
        <p className="page-subtitle">Ask anything. Solvent AI will help you work through it.</p>
        {limitInfo && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {limitInfo.remaining} of {limitInfo.limit} messages left today
          </p>
        )}
      </div>

      <div className="solvent-chat-card">
        <div className="solvent-chat-messages">
          {messages.length === 0 && (
            <div className="solvent-chat-empty">
              <FiCpu style={{ fontSize: '2rem', color: 'var(--color-blue)', marginBottom: '0.75rem' }} />
              <p>Ask Solvent AI a question to get started.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`solvent-msg-row ${m.role === 'user' ? 'solvent-msg-row-user' : ''}`}>
              <div className={`solvent-msg-avatar ${m.role === 'user' ? 'solvent-msg-avatar-user' : 'solvent-msg-avatar-ai'}`}>
                {m.role === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              <div className={`solvent-msg-bubble ${m.role === 'user' ? 'solvent-msg-bubble-user' : 'solvent-msg-bubble-ai'}`}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="solvent-msg-row">
              <div className="solvent-msg-avatar solvent-msg-avatar-ai"><FiCpu /></div>
              <div className="solvent-msg-bubble solvent-msg-bubble-ai solvent-msg-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && <div className="solvent-chat-error">{error}</div>}

        <form className="solvent-chat-input-row" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Solvent AI anything..."
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolventAI;