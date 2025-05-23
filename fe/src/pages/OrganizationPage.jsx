import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const OrganizationPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({ name: '', mission: '', contactInfo: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchOrganizations = async () => {
    const res = await fetch('http://localhost:3000/api/v1/orgs/');
    const data = await res.json();
    setOrganizations(data);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/v1/orgs/${editingId}` : 'http://localhost:3000/api/v1/orgs/';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ name: '', mission: '', contactInfo: '' });
    setEditingId(null);
    fetchOrganizations();
  };

  const handleEdit = (org) => {
    setFormData({ name: org.name, mission: org.mission || '', contactInfo: org.contactInfo || '' });
    setEditingId(org.id);
  };

  const handleDelete = async (id) => {
    
      await fetch(`http://localhost:3000/api/v1/orgs/${id}`, { method: 'DELETE' });
      fetchOrganizations();
    
  };

  return (
    <Layout>
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">{editingId ? 'Edit Organization' : 'Add Organization'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
        <input
          type="text"
          placeholder="Organization Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Mission"
          value={formData.mission}
          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={formData.contactInfo}
          onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', mission: '', contactInfo: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-2 dark:text-white">Organizations</h3>
      <ul className="space-y-4">
        {organizations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No organizations found.</p>
        ) : (
          organizations.map((org) => (
            <li
              key={org.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-bold dark:text-white">{org.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mission: {org.mission || 'N/A'} | Contact: {org.contactInfo || 'N/A'}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(org)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(org.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
    </Layout>
  );
};

export default OrganizationPage;
