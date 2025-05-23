import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Building2, CalendarDays, Users, Mail } from 'lucide-react';
import EventOccurence from '../components/EventOccurence';

const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgRes, eventRes] = await Promise.all([
          fetch('http://localhost:3000/api/v1/orgs/'),
          fetch('http://localhost:3000/api/v1/events/'),
        ]);

        const orgData = await orgRes.json();
        const eventData = await eventRes.json();

        setOrganizations(orgData);
        setEvents(eventData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="p-4 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Organizations</h3>
                <p className="text-3xl font-bold mt-2">{organizations.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Events</h3>
                <p className="text-3xl font-bold mt-2">{events.length}</p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Volunteers</h3>
                <p className="text-3xl font-bold mt-2">124</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <p className="text-3xl font-bold mt-2">56</p>
              </div>
            </div>

            {/* Organizations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Organizations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                  >
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{org.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{org.mission}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {org.contactInfo}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" /> Upcoming Events
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventOccurence event={event}></EventOccurence>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
