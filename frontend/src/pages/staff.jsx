import { useState, useEffect } from 'react';

function Staff({ role }) {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    FirstName: '', LastName: '', Email: '', Phone: '', DepartmentID: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const isAdmin = role === 'admin';

  const fetchStaff = () => {
    fetch('http://localhost:5000/api/staff')
      .then(res => res.json())
      .then(data => { setStaff(data); setLoading(false); });
    fetch('http://localhost:5000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:5000/api/staff/${deleteTargetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('frsc_token')}` }
    })
      .then(() => { fetchStaff(); setDeleteTargetId(null); });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.FirstName.trim()) newErrors.FirstName = 'First name is required';
    if (!formData.LastName.trim()) newErrors.LastName = 'Last name is required';
    if (!formData.Email.trim()) newErrors.Email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) newErrors.Email = 'Enter a valid email address';
    if (!formData.Phone.trim()) newErrors.Phone = 'Phone number is required';
    else if (!/^\d{11}$/.test(formData.Phone)) newErrors.Phone = 'Phone must be 11 digits';
    if (!formData.DepartmentID) newErrors.DepartmentID = 'Please select a department';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    const method = editingStaff ? 'PUT' : 'POST';
    const url = editingStaff
      ? `http://localhost:5000/api/staff/${editingStaff.StaffID}`
      : 'http://localhost:5000/api/staff';
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('frsc_token')}`
      },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchStaff();
      setShowForm(false);
      setEditingStaff(null);
      setFormData({ FirstName: '', LastName: '', Email: '', Phone: '', DepartmentID: '' });
    });
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      FirstName: member.FirstName,
      LastName: member.LastName,
      Email: member.Email,
      Phone: member.Phone,
      DepartmentID: member.DepartmentID
    });
    setErrors({});
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingStaff(null);
    setFormData({ FirstName: '', LastName: '', Email: '', Phone: '', DepartmentID: '' });
    setErrors({});
    setShowForm(true);
  };

  if (loading) return <div style={styles.loading}>Loading staff...</div>;

  return (
    <div style={styles.page}>

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <div style={styles.dialogIcon}>🗑️</div>
            <h3 style={styles.dialogTitle}>Delete Staff Member?</h3>
            <p style={styles.dialogText}>This action cannot be undone. Any devices assigned to this staff member will be unassigned.</p>
            <div style={styles.dialogButtons}>
              <button style={styles.dialogCancel} onClick={() => setDeleteTargetId(null)}>Cancel</button>
              <button style={styles.dialogConfirm} onClick={handleDeleteConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Staff</h1>
          <p style={styles.pageSubtitle}>{staff.length} record{staff.length !== 1 ? 's' : ''} found</p>
        </div>
        {isAdmin && (
          <button style={styles.addBtn} onClick={openAddForm}>+ Add Staff</button>
        )}
      </div>

      {isAdmin && showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editingStaff ? '✏️ Edit Staff Member' : '➕ Add New Staff Member'}</h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input style={{ ...styles.input, ...(errors.FirstName ? styles.inputError : {}) }} placeholder="e.g. Emeka" value={formData.FirstName} onChange={e => setFormData({ ...formData, FirstName: e.target.value })} />
              {errors.FirstName && <span style={styles.errorText}>{errors.FirstName}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input style={{ ...styles.input, ...(errors.LastName ? styles.inputError : {}) }} placeholder="e.g. Ojo" value={formData.LastName} onChange={e => setFormData({ ...formData, LastName: e.target.value })} />
              {errors.LastName && <span style={styles.errorText}>{errors.LastName}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input style={{ ...styles.input, ...(errors.Email ? styles.inputError : {}) }} placeholder="e.g. emeka@frsc.gov.ng" value={formData.Email} onChange={e => setFormData({ ...formData, Email: e.target.value })} />
              {errors.Email && <span style={styles.errorText}>{errors.Email}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input style={{ ...styles.input, ...(errors.Phone ? styles.inputError : {}) }} placeholder="e.g. 08012345678" value={formData.Phone} onChange={e => setFormData({ ...formData, Phone: e.target.value })} />
              {errors.Phone && <span style={styles.errorText}>{errors.Phone}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Department</label>
              <select style={{ ...styles.input, ...(errors.DepartmentID ? styles.inputError : {}) }} value={formData.DepartmentID} onChange={e => setFormData({ ...formData, DepartmentID: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>{dept.DepartmentName}</option>
                ))}
              </select>
              {errors.DepartmentID && <span style={styles.errorText}>{errors.DepartmentID}</span>}
            </div>
          </div>
          <div style={styles.formButtons}>
            <button style={styles.saveBtn} onClick={handleSubmit}>{editingStaff ? 'Update Staff' : 'Save Staff'}</button>
            <button style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditingStaff(null); setErrors({}); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Department</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {staff.map((member, index) => (
              <tr key={member.StaffID} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}><span style={styles.idBadge}>{index + 1}</span></td>
                <td style={styles.td}>{member.FirstName}</td>
                <td style={styles.td}>{member.LastName}</td>
                <td style={styles.td}>{member.Email}</td>
                <td style={styles.td}>{member.Phone}</td>
                <td style={styles.td}>
                  {departments.find(d => d.DepartmentID === member.DepartmentID)?.DepartmentName
                    || <span style={styles.nullBadge}>Unassigned</span>}
                </td>
                {isAdmin && (
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(member)}>✏️ Edit</button>
                    <button style={styles.deleteBtn} onClick={() => setDeleteTargetId(member.StaffID)}>🗑️ Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const GREEN = '#12aafc';

const styles = {
  page: { padding: '2rem 2.5rem', maxWidth: '1100px' },
  loading: { padding: '3rem', color: '#666' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', color: GREEN, margin: 0 },
  pageSubtitle: { color: '#666', fontSize: '0.9rem', marginTop: '4px' },
  addBtn: { backgroundColor: GREEN, color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 2px 6px rgba(0,83,15,0.3)' },
  formCard: { backgroundColor: 'white', padding: '1.8rem', borderRadius: '10px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${GREEN}` },
  formTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  inputError: { border: '1px solid #e74c3c', backgroundColor: '#fff8f8' },
  errorText: { fontSize: '0.75rem', color: '#e74c3c', marginTop: '2px' },
  formButtons: { display: 'flex', gap: '10px' },
  saveBtn: { backgroundColor: GREEN, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  cancelBtn: { backgroundColor: '#f0f0f0', color: '#555', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeadRow: { backgroundColor: GREEN },
  th: { padding: '12px 16px', textAlign: 'left', color: 'white', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  trEven: { backgroundColor: '#ffffff' },
  trOdd: { backgroundColor: '#f9fafb' },
  td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  idBadge: { backgroundColor: '#e8f5e9', color: GREEN, padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600' },
  nullBadge: { backgroundColor: '#f5f5f5', color: '#999', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
  editBtn: { backgroundColor: '#fff8e1', color: '#c8820a', border: '1px solid #f0d080', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', marginRight: '6px', fontSize: '13px', fontWeight: '600' },
  deleteBtn: { backgroundColor: '#fdecea', color: '#c0392b', border: '1px solid #f5c0bb', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  dialog: { backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '380px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  dialogIcon: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  dialogTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.6rem' },
  dialogText: { fontSize: '0.88rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' },
  dialogButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  dialogCancel: { backgroundColor: '#f0f0f0', color: '#555', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  dialogConfirm: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};

export default Staff;
