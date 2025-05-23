import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const AttendancePage = () => {
  const [volunteers, setVolunteers] = useState([]);
  // const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    const res = await fetch('http://localhost:3000/api/v1/vols');
    const vols = await res.json();
    const assignmentsWithAttendance = await Promise.all(
      vols.map(async (vol) => {
        const res = await fetch(`http://localhost:3000/api/v1/assigns/byVol/${vol.id}`);
        const assigns = await res.json();
        return { ...vol, assignments: assigns };
      })
    );
    setVolunteers(assignmentsWithAttendance);
  };

  const handleAttendance = async (assignId, existing) => {
    const now = new Date();
    if (existing) {
      const res = await fetch(`http://localhost:3000/api/v1/attend/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkOutTime: now,
          hoursWorked: (new Date(now).getTime() - new Date(existing.checkInTime).getTime()) / (1000 * 60 * 60),
        }),
      });
    } else {
      await fetch(`http://localhost:3000/api/v1/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignId,
          checkInTime: now,
          hoursWorked: 0,
        }),
      });
    }
    fetchVolunteers();
  };

  return (
    <Layout>
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Attendance Tracking</h2>
      {volunteers.map((vol) => (
        <div key={vol.id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {vol.firstName} {vol.lastName}
          </h3>
          {vol.assignments?.length === 0 && (
            <p className="text-sm text-gray-500">No assignments</p>
          )}
          <ul className="mt-2 space-y-3">
            {vol.assignments?.map((a) => (
              <li
                key={a.id}
                className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded"
              >
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Task Name: {a.task?.name} | Assigned: {new Date(a.assignDate).toLocaleDateString()}
                  </p>
                  {a.attendance ? (
                    <p className="text-xs text-green-500">
                      Checked in: {new Date(a.attendance.checkInTime).toLocaleTimeString()}
                      {a.attendance.checkOutTime && (
                        <>
                          {' '}– Checked out: {new Date(a.attendance.checkOutTime).toLocaleTimeString()}
                          {' '}| Hours Worked: {a.attendance.hoursWorked.toFixed(2)}
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-500">Not checked in</p>
                  )}
                </div>
                <button
                  onClick={() => handleAttendance(a.id, a.attendance)}
                  className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {a.attendance?.checkOutTime ? '✓ Done' : a.attendance ? 'Check Out' : 'Check In'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </Layout>
  );
};

export default AttendancePage;
