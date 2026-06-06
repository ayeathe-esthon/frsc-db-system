import { useState } from 'react';
import Icon  from '../components/icons'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('frsc_token', data.token);
          navigate('/');
        } else {
          setError(data.error || 'Login failed.');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Could not connect to server.');
        setLoading(false);
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo Area */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🛡️</div>
          <h1 style={styles.logoText}>FRSC HQ</h1>
          <p style={styles.logoSub}>IT Department — Database System</p>
        </div>

        {/* Form */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative' }}>
  <input
    style={{ ...styles.input, paddingRight: '40px' }}
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter password"
    value={password}
    onChange={e => setPassword(e.target.value)}
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px' }}
  >
    {showPassword ? <Icon name="eyeOff" size={16} /> : <Icon name="eye" size = {16}/>}
  </span>
</div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.footer}>Federal Road Safety Corps — Internal Use Only</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '380px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderTop: '5px solid #12aafc',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#12aafc',
    margin: 0,
  },
  logoSub: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '4px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '1rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.82rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    backgroundColor: '#12aafc',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#aaa',
  },
};