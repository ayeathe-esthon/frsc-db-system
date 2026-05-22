import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const newErrors = {};
    if (!currentPassword.trim()) newErrors.currentPassword = 'Current password is required';
    if (!newPassword.trim()) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your new password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setLoading(true);

    const token = localStorage.getItem('frsc_token');

    fetch('http://localhost:5000/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.message) {
          setSuccess('Password changed successfully! Please log in again.');
          setTimeout(() => {
            localStorage.removeItem('frsc_token');
            navigate('/login');
          }, 2000);
        } else {
          setErrors({ currentPassword: data.error });
        }
      })
      .catch(() => {
        setLoading(false);
        setErrors({ currentPassword: 'Could not connect to server.' });
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Change Password</h1>
        <p style={styles.pageSubtitle}>Update your account password</p>
      </div>

      <div style={styles.formCard}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Current Password</label>
          <input
            style={{ ...styles.input, ...(errors.currentPassword ? styles.inputError : {}) }}
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          {errors.currentPassword && <span style={styles.errorText}>{errors.currentPassword}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>New Password</label>
          <input
            style={{ ...styles.input, ...(errors.newPassword ? styles.inputError : {}) }}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          {errors.newPassword && <span style={styles.errorText}>{errors.newPassword}</span>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm New Password</label>
          <input
            style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        {success && <p style={styles.successText}>{success}</p>}

        <div style={styles.formButtons}>
          <button
            style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button style={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const GREEN = '#12aafc';

const styles = {
  page: { padding: '2rem 2.5rem', maxWidth: '500px', margin: '0 auto' },
  pageHeader: { marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: GREEN, margin: 0 },
  pageSubtitle: { color: '#666', fontSize: '0.9rem', marginTop: '4px' },
  formCard: { backgroundColor: 'white', padding: '1.8rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${GREEN}` },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' },
  label: { fontSize: '0.78rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  inputError: { border: '1px solid #e74c3c', backgroundColor: '#fff8f8' },
  errorText: { fontSize: '0.75rem', color: '#e74c3c', marginTop: '2px' },
  successText: { fontSize: '0.85rem', color: '#00853f', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' },
  formButtons: { display: 'flex', gap: '10px', marginTop: '0.5rem' },
  saveBtn: { backgroundColor: GREEN, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  cancelBtn: { backgroundColor: '#f0f0f0', color: '#555', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};