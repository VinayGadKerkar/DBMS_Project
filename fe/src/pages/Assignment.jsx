'use client';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    const res = await fetch('http://localhost:3000/api/v1/vols/');
    const data = await res.json();
    setVolunteers(data);

    // For each volunteer, fetch their assignments
    const allAssignments = await Promise.all(
      data.map(async (vol) => {
        const res = await fetch(`http://localhost:3000/api/v1/assigns/byVol/${vol.id}`);
        const assigns = await res.json();
        return { ...vol, assignments: assigns };
      })
    );

    setAssignments(allAssignments);
  };

  const updateStatus = async (assignmentId, newStatus) => {
    await fetch(`http://localhost:3000/api/v1/assigns/${assignmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchVolunteers(); // Refresh assignments
  };

  return (
    <Layout>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Volunteer Assignments</h1>

      {assignments.map((vol) => (
        <div
          key={vol.id}
          className="mb-8 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow"
        >
          <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 font-semibold text-lg dark:text-white">
            {vol.firstName} {vol.lastName} ({vol.email})
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 space-y-4">
            {vol.assignments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No assignments</p>
            ) : (
              vol.assignments.map((a) => (
                <div
                  key={a.id}
                  className="border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Task: {a.task?.name} | Event: {a.task?.event?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assigned on: {new Date(a.assignDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status: <strong>{(a.task.status).toUpperCase()}</strong></p>
                      {a.attendance && (
                        <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                          ✅ Checked In: {new Date(a.attendance.checkInTime).toLocaleString()}<br />
                          ⏱ Hours Worked: {a.attendance.hoursWorked.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Edit Status Dropdown */}
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
    </Layout>
  );
};

export default AssignmentPage;
