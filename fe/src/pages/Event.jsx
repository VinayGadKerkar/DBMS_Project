import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({ name: '', dates: '', orgId: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchEvents = async () => {
    const res = await fetch('http://localhost:3000/api/v1/events/');
    const data = await res.json();
    setEvents(data);
  };

  const fetchOrganizations = async () => {
    const res = await fetch('http://localhost:3000/api/v1/orgs/');
    const data = await res.json();
    setOrganizations(data);
  };

  useEffect(() => {
    fetchEvents();
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, orgId: parseInt(formData.orgId) };
    const url = editingId ? `http://localhost:3000/api/v1/events/${editingId}` : 'http://localhost:3000/api/v1/events/';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setFormData({ name: '', dates: '', orgId: '' });
    setEditingId(null);
    fetchEvents();
  };

  const handleEdit = (event) => {
    setFormData({ name: event.name, dates: event.dates, orgId: event.orgId.toString() });
    setEditingId(event.id);
  };

  const handleDelete = async (id) => {
   
      await fetch(`http://localhost:3000/api/v1/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    
  };

  return (
    <Layout>

   
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">{editingId ? 'Edit Event' : 'Add Event'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
        <input
          type="text"
          placeholder="Event Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Event Dates"
          value={formData.dates}
          onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <select
          required
          value={formData.orgId}
          onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', dates: '', orgId: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-2 dark:text-white">Events</h3>
      <ul className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No events found.</p>
        ) : (
          events.map((event) => (
            <li
              key={event.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-bold dark:text-white">{event.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Dates: {event.dates} | Organization: {event.organization?.name || event.orgId}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(event)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="bg-red-600 text-white px-3 py-1 rounded">
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

export default EventPage;
