import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const ITEMS_PER_PAGE = 5;

const VolunteerPage = () => {
  const [newSkill, setNewSkill] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', status: '', orgId: '', skillIds: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const addSkill = async () => {
  if (!newSkill.trim()) return;
  await fetch('http://localhost:3000/api/v1/skills/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newSkill.trim() }),
  });
  setNewSkill('');
  fetchSkills();
};

  const fetchVolunteers = async () => {
    const res = await fetch('http://localhost:3000/api/v1/vols/');
    const data = await res.json();
    setVolunteers(data);
  };

  const fetchOrganizations = async () => {
    const res = await fetch('http://localhost:3000/api/v1/orgs/');
    const data = await res.json();
    setOrganizations(data);
  };

  const fetchSkills = async () => {
    const res = await fetch('http://localhost:3000/api/v1/skills/');
    const data = await res.json();
    setSkills(data);
  };

  useEffect(() => {
    fetchVolunteers();
    fetchOrganizations();
    fetchSkills();
  }, []);

  const filteredVolunteers = volunteers.filter((v) =>
    `${v.firstName} ${v.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filteredVolunteers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      orgId: parseInt(formData.orgId),
      skillIds: formData.skillIds.map(Number),
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3000/api/v1/vols/${editingId}` : 'http://localhost:3000/api/v1/vols/';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setFormData({ firstName: '', lastName: '', email: '', status: '', orgId: '', skillIds: [] });
    setEditingId(null);
    fetchVolunteers();
  };

  const handleEdit = (v) => {
    setFormData({
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      status: v.status,
      orgId: v.orgId.toString(),
      skillIds: v.skills?.map((s) => s.skillId.toString()) || [],
    });
    setEditingId(v.id);
  };

  const handleDelete = async (id) => {
    
      await fetch(`http://localhost:3000/api/v1/vols/${id}`, { method: 'DELETE' });
      fetchVolunteers();
    
  };

  return (
    <Layout>
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        {editingId ? 'Edit Volunteer' : 'Add Volunteer'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow mb-10">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" required value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
          <input type="text" placeholder="Last Name" required value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <input type="email" placeholder="Email" required value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input type="text" placeholder="Status" value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

        {/* Organization Dropdown */}
        <select value={formData.orgId} required
          onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>


        {/* Skill Multi-select */}
        {/* <div className="text-sm font-medium text-gray-600 dark:text-white">Skills:</div>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-2 text-sm dark:text-white">
              <input
                type="checkbox"
                value={skill.id}
                checked={formData.skillIds.includes(skill.id.toString())}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    skillIds: checked
                      ? [...prev.skillIds, skill.id.toString()]
                      : prev.skillIds.filter((id) => id !== skill.id.toString()),
                  }));
                }}
              />
              {skill.name}
            </label>
          ))}
        </div> */}
        <div>
  <div className="flex justify-between items-center mb-1">
    <span className="text-sm font-medium text-gray-600 dark:text-white">Skills:</span>
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="New skill"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        className="p-1 text-sm border rounded dark:bg-gray-700 dark:text-white"
      />
      <button type="button" onClick={addSkill} className="text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
        Add
      </button>
    </div>
  </div>
  <div className="grid grid-cols-2 gap-2">
    {skills.map((skill) => (
      <label key={skill.id} className="flex items-center gap-2 text-sm dark:text-white">
        <input
          type="checkbox"
          value={skill.id}
          checked={formData.skillIds.includes(skill.id.toString())}
          onChange={(e) => {
            const checked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              skillIds: checked
                ? [...prev.skillIds, skill.id.toString()]
                : prev.skillIds.filter((id) => id !== skill.id.toString()),
            }));
          }}
        />
        {(skill.name).charAt(0).toUpperCase()+(skill.name).slice(1)}
      </label>
    ))}
  </div>
</div>


        <div className="flex gap-3 mt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={() => {
              setFormData({ firstName: '', lastName: '', email: '', status: '', orgId: '', skillIds: [] });
              setEditingId(null);
            }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>

      {/* Search and Pagination */}
      <div className="mb-4 flex justify-between items-center">
        <input type="text" placeholder="Search volunteers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64 p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <div className="text-sm text-gray-600 dark:text-white">
          Page {page} of {Math.ceil(filteredVolunteers.length / ITEMS_PER_PAGE)}
        </div>
      </div>

      {/* Volunteer List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">Volunteer List</h2>
        {filteredVolunteers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No volunteers found.</p>
        ) : (
          <ul className="space-y-4">
            {paginated.map((v) => (
              <li key={v.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">{v.firstName} {v.lastName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{v.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {v.status} | Org: {v.organization?.name || v.orgId} | Skills: {v.skills?.map((s) => (s.skill.name).charAt(0).toUpperCase()+(s.skill.name).slice(1)).join(', ')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(v)} className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
          className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded disabled:opacity-50">Previous</button>
        <button disabled={page * ITEMS_PER_PAGE >= filteredVolunteers.length}
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
    </Layout>
  );
};

export default VolunteerPage;
