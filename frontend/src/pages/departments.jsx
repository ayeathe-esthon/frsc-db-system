import { useState, useEffect } from 'react';
import Icon from '../components/icons';

const CYAN = '#12aafc';

function Departments({ role }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ DepartmentName: '', ManagementLevel: '' });
  const [errors, setErrors] = useState({});
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const isAdmin = role === 'admin';

  const fetchDepartments = () => {
    fetch('http://localhost:5000/api/departments')
      .then(res => res.json())
      .then(data => { setDepartments(data); setLoading(false); });
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:5000/api/departments/${deleteTargetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('frsc_token')}` }
    }).then(() => { fetchDepartments(); setDeleteTargetId(null); });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.DepartmentName.trim()) newErrors.DepartmentName = 'Department name is required';
    if (!formData.ManagementLevel) newErrors.ManagementLevel = 'Please select a management level';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    const method = editingDept ? 'PUT' : 'POST';
    const url = editingDept
      ? `http://localhost:5000/api/departments/${editingDept.DepartmentID}`
      : 'http://localhost:5000/api/departments';
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('frsc_token')}`
      },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchDepartments();
      setShowForm(false);
      setEditingDept(null);
      setFormData({ DepartmentName: '', ManagementLevel: '' });
    });
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ DepartmentName: dept.DepartmentName, ManagementLevel: dept.ManagementLevel });
    setErrors({});
    setShowForm(true);
  };

  const levelColors = {
    Senior: { bg: '#e8f5e9', color: '#12aafc' },
    Middle: { bg: '#fff8e1', color: '#c8820a' },
    Junior: { bg: '#e3f2fd', color: '#1a6eb5' },
  };

  if (loading) return <div style={styles.loading}>Loading departments...</div>;

  return (
    <div style={styles.page}>

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <div style={styles.dialogIcon}>
              <Icon name="trash" size={32} style={{ color: '#c0392b' }} />
            </div>
            <h3 style={styles.dialogTitle}>Delete Department?</h3>
            <p style={styles.dialogText}>This action cannot be undone. Staff members in this department will be unassigned.</p>
            <div style={styles.dialogButtons}>
              <button style={styles.dialogCancel} onClick={() => setDeleteTargetId(null)}>Cancel</button>
              <button style={styles.dialogConfirm} onClick={handleDeleteConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Departments</h1>
          <p style={styles.pageSubtitle}>{departments.length} department{departments.length !== 1 ? 's' : ''} found</p>
        </div>
        {isAdmin && (
          <button style={styles.addBtn} onClick={() => { setShowForm(true); setEditingDept(null); setFormData({ DepartmentName: '', ManagementLevel: '' }); setErrors({}); }}>
            <Icon name="plus" size={15} style={{ marginRight: '6px' }} />
            Add Department
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {editingDept ? (
              <><Icon name="edit" size={16} style={{ marginRight: '8px' }} />Edit Department</>
            ) : (
              <><Icon name="plus" size={16} style={{ marginRight: '8px' }} />Add New Department</>
            )}
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Department Name</label>
              <input
                style={{ ...styles.input, ...(errors.DepartmentName ? styles.inputError : {}) }}
                placeholder="e.g. Information Technology"
                value={formData.DepartmentName}
                onChange={e => setFormData({ ...formData, DepartmentName: e.target.value })}
              />
              {errors.DepartmentName && <span style={styles.errorText}>{errors.DepartmentName}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Management Level</label>
              <select
                style={{ ...styles.input, ...(errors.ManagementLevel ? styles.inputError : {}) }}
                value={formData.ManagementLevel}
                onChange={e => setFormData({ ...formData, ManagementLevel: e.target.value })}
              >
                <option value="">Select Level</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
              {errors.ManagementLevel && <span style={styles.errorText}>{errors.ManagementLevel}</span>}
            </div>
          </div>
          <div style={styles.formButtons}>
            <button style={styles.saveBtn} onClick={handleSubmit}>{editingDept ? 'Update Department' : 'Save Department'}</button>
            <button style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditingDept(null); setErrors({}); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Department Name</th>
              <th style={styles.th}>Management Level</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => {
              const levelStyle = levelColors[dept.ManagementLevel] || { bg: '#f5f5f5', color: '#999' };
              return (
                <tr key={dept.DepartmentID} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><span style={styles.idBadge}>{index + 1}</span></td>
                  <td style={styles.td}><strong>{dept.DepartmentName}</strong></td>
                  <td style={styles.td}>
                    <span style={{ backgroundColor: levelStyle.bg, color: levelStyle.color, padding: '3px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {dept.ManagementLevel}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => handleEdit(dept)}>
                        <Icon name="edit" size={13} style={{ marginRight: '5px' }} />
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => setDeleteTargetId(dept.DepartmentID)}>
                        <Icon name="trash" size={13} style={{ marginRight: '5px' }} />
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '2rem 2.5rem', maxWidth: '1100px' },
  loading: { padding: '3rem', color: '#666' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: CYAN, margin: 0 },
  pageSubtitle: { color: '#666', fontSize: '0.9rem', marginTop: '4px' },
  addBtn: { display: 'flex', alignItems: 'center', backgroundColor: CYAN, color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 6px rgba(18,170,252,0.3)' },
  formCard: { backgroundColor: 'white', padding: '1.8rem', borderRadius: '10px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${CYAN}` },
  formTitle: { display: 'flex', alignItems: 'center', fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  inputError: { border: '1px solid #e74c3c', backgroundColor: '#fff8f8' },
  errorText: { fontSize: '0.75rem', color: '#e74c3c', marginTop: '2px' },
  formButtons: { display: 'flex', gap: '10px' },
  saveBtn: { backgroundColor: CYAN, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  cancelBtn: { backgroundColor: '#f0f0f0', color: '#555', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeadRow: { backgroundColor: CYAN },
  th: { padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  trEven: { backgroundColor: '#ffffff' },
  trOdd: { backgroundColor: '#f9fafb' },
  td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  idBadge: { backgroundColor: '#eaf6ff', color: CYAN, padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600' },
  editBtn: { display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff8e1', color: '#c8820a', border: '1px solid #f0d080', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', marginRight: '6px', fontSize: '13px', fontWeight: '600' },
  deleteBtn: { display: 'inline-flex', alignItems: 'center', backgroundColor: '#fdecea', color: '#c0392b', border: '1px solid #f5c0bb', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  dialog: { backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '380px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  dialogIcon: { marginBottom: '0.8rem', display: 'flex', justifyContent: 'center' },
  dialogTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.6rem' },
  dialogText: { fontSize: '0.88rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' },
  dialogButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  dialogCancel: { backgroundColor: '#f0f0f0', color: '#555', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  dialogConfirm: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};

export default Departments;