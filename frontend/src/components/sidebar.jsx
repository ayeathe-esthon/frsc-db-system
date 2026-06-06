import { NavLink, useNavigate } from 'react-router-dom';
import Icon from './icons';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('frsc_token');
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      {/* Logo area */}
      <div style={styles.logoArea}>
        <Icon name="shield" size={28} style={{ color: 'white' }} />
        <div>
          <div style={styles.logoText}>FRSC HQ</div>
          <div style={styles.logoSub}>IT Department</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      <p style={styles.menuLabel}>MAIN MENU</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/" end style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <Icon name="dashboard" size={16} /> Dashboard
        </NavLink>
        <NavLink to="/staff" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <Icon name="users" size={16} /> Staff
        </NavLink>
        <NavLink to="/departments" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <Icon name="building" size={16} /> Departments
        </NavLink>
        <NavLink to="/devices" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <Icon name="monitor" size={16} /> Devices
        </NavLink>
      </nav>

      {/* Divider */}
      <div style={{ ...styles.divider, marginTop: '16px' }} />

      <p style={styles.menuLabel}>ACCOUNT</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/change-password" style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}>
          <Icon name="key" size={16} /> Change Password
        </NavLink>
      </nav>

      {/* Footer */}
      <div style={styles.sidebarFooter}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <Icon name="logout" size={14} style={{ marginRight: '8px' }} />
          Logout
        </button>
        <div style={styles.footerBadge}>Federal Road Safety Corps</div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    backgroundColor: '#12aafc',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingLeft: '8px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  logoSub: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.3px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: '20px',
  },
  menuLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '1.5px',
    fontWeight: '600',
    paddingLeft: '12px',
    marginBottom: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '11px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: '0.5px',
  },
  activeLink: {
    backgroundColor: '#ffffff',
    color: '#12aafc',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.15)',
  },
  footerBadge: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
  },
};

export default Sidebar;