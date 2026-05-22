import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentStaff, setRecentStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentStaff(data.recentStaff);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>FRSC HQ IT Department — System Overview</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Main Count Cards */}
      <div style={styles.cardGrid}>
        <StatCard title="Total Staff" value={stats.totalStaff} color="#12aafc" icon="👥" />
        <StatCard title="Departments" value={stats.totalDepartments} color="#1a6eb5" icon="🏢" />
        <StatCard title="Total Devices" value={stats.totalDevices} color="#6a0dad" icon="💻" />
      </div>

      {/* Device Status Breakdown */}
      <div style={styles.deviceSection}>
        <div style={styles.deviceSectionHeader}>
          <span style={styles.deviceSectionIcon}>💻</span>
          <span style={styles.deviceSectionTitle}>Device Status Breakdown</span>
        </div>
        <div style={styles.cardGrid}>
          <StatCard title="Active" value={stats.activeDevices} color="#00853f" icon="✅" />
          <StatCard title="Under Maintenance" value={stats.maintenanceDevices} color="#c8820a" icon="🔧" />
          <StatCard title="Decommissioned" value={stats.decommissionedDevices} color="#c0392b" icon="🚫" />
        </div>
      </div>

      {/* Recent Staff Table */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recently Added Staff</h2>
          <span style={styles.sectionBadge}>Last 5 records</span>
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {recentStaff.map((s, index) => (
              <tr key={s.StaffID} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>
                  <span style={styles.idBadge}>#{s.StaffID}</span>
                </td>
                <td style={styles.td}>{s.FirstName}</td>
                <td style={styles.td}>{s.LastName}</td>
                <td style={styles.td}>{s.Email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{ ...styles.card, borderLeft: `5px solid ${color}` }}>
      <div style={styles.cardTop}>
        <p style={styles.cardTitle}>{title}</p>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem 2.5rem',
    maxWidth: '1100px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  pageTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#12aafc',
    margin: 0,
  },
  pageSubtitle: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  dateBadge: {
    backgroundColor: '#e8f5e9',
    color: '#12aafc',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: '1px solid #c8e6c9',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  deviceSection: {
    backgroundColor: '#faf7ff',
    borderRadius: '10px',
    padding: '1.2rem 1.4rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    border: '1px solid #e8d5ff',
    borderTop: '4px solid #6a0dad',
  },
  deviceSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid #e8d5ff',
  },
  deviceSectionIcon: {
    fontSize: '18px',
  },
  deviceSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#6a0dad',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '1.2rem 1.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  cardTitle: {
    fontSize: '0.78rem',
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '2.2rem',
    fontWeight: '700',
    lineHeight: 1,
  },
  section: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  sectionBadge: {
    backgroundColor: '#e8f5e9',
    color: '#12aafc',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeadRow: {
    backgroundColor: '#12aafc',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  trEven: { backgroundColor: '#ffffff' },
  trOdd: { backgroundColor: '#f9fafb' },
  td: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '0.9rem',
    color: '#333',
  },
  idBadge: {
    backgroundColor: '#e8f5e9',
    color: '#12aafc',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  loading: {
    padding: '3rem',
    color: '#666',
    fontSize: '1rem',
  },
  error: {
    padding: '3rem',
    color: '#c0392b',
    fontSize: '1rem',
  },
};