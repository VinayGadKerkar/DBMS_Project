import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [expandedEventIds, setExpandedEventIds] = useState(new Set());
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    numRequired: 1,
    scheduleTime: '',
    eventId: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const [tasksRes, eventsRes, volsRes] = await Promise.all([
      fetch('http://localhost:3000/api/v1/tasks/'),
      fetch('http://localhost:3000/api/v1/events/'),
      fetch('http://localhost:3000/api/v1/vols/'),
    ]);

    const [tasksData, eventsData, volsData] = await Promise.all([
      tasksRes.json(),
      eventsRes.json(),
      volsRes.json(),
    ]);

    // Add selectedVolunteerId to each task
    const enrichedTasks = tasksData.map((task) => ({ ...task, selectedVolunteerId: '' }));

    setTasks(enrichedTasks);
    setEvents(eventsData);
    setVolunteers(volsData);
  };

  const toggleEvent = (eventId) => {
    const newSet = new Set(expandedEventIds);
    newSet.has(eventId) ? newSet.delete(eventId) : newSet.add(eventId);
    setExpandedEventIds(newSet);
  };

  const assignVolunteer = async (taskId, volId) => {
    if (!volId) return;

    await fetch('http://localhost:3000/api/v1/assigns/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, volId }),
    });

    fetchAllData(); // refresh assignments
  };

  const unassignVolunteer = async (assignmentId) => {
    await fetch(`http://localhost:3000/api/v1/assigns/${assignmentId}`, { method: 'DELETE' });
    fetchAllData();
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.eventId) return;

    await fetch('http://localhost:3000/api/v1/tasks/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    setNewTask({ name: '', description: '', numRequired: 1, scheduleTime: '', eventId: null });
    fetchAllData();
  };

  const tasksByEvent = events.map((event) => ({
    ...event,
    tasks: tasks.filter((task) => task.eventId === event.id)
    ,
  }));

  const updateTaskStatus = async (taskId, status) => {
    await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchAllData();
  };


  return (
    <Layout>
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Tasks by Event</h2>
      {tasksByEvent.map((event) => (
        <div key={event.id} className="mb-8 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
          <div
            onClick={() => toggleEvent(event.id)}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 text-lg font-semibold flex justify-between items-center"
          >
            <span>{event.name}</span>
            <span>{expandedEventIds.has(event.id) ? '−' : '+'}</span>
          </div>

          {expandedEventIds.has(event.id) && (
            <div className="p-6 bg-white dark:bg-gray-900 space-y-6">
              {event.tasks.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No tasks for this event.</p>
              )}

              {event.tasks.filter((task) => task.status === 'active').map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${task.status === 'suspended' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    task.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-gray-100 dark:bg-gray-800'} border-gray-200 dark:border-gray-700`}
                >
                  <h3 className="text-lg font-bold dark:text-white">{task.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: <span className="font-semibold">{task.status}</span> | Required Volunteers: {task.numRequired} | Scheduled: {task.scheduleTime}
                  </p>

                  <div className="mt-2 flex gap-2">
                    {task.status !== 'suspended' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'suspended')}
                        className="text-yellow-600 dark:text-yellow-400 text-sm hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="text-green-600 dark:text-green-400 text-sm hover:underline"
                      >
                        Mark Completed
                      </button>
                    )}

                  </div>
                  {/* Volunteer Assignment Section */}
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Assign Volunteer
                    </label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={task.selectedVolunteerId || ''}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value);
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? { ...t, selectedVolunteerId: selectedId } : t
                            )
                          );
                        }}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="" disabled>Select volunteer</option>
                        {volunteers
                          .filter((v) => !task.assignments.some((a) => a.volunteer.id === v.id))
                          .map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.firstName} {v.lastName} ({v.email})
                            </option>
                          ))}
                      </select>

                      <button
                        disabled={!task.selectedVolunteerId}
                        onClick={() => assignVolunteer(task.id, task.selectedVolunteerId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  </div>

                  {/* Assigned Volunteers List */}
                  {task.assignments?.length > 0 && (

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Assigned Volunteers:</h4>
                      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        {task.assignments.map((a) => (
                          <div
                            key={a.id}
                            className="flex justify-between items-center border-b pb-2 dark:border-gray-700"
                          >
                            <div className="text-lg">
                              {a.volunteer
                                ? `${a.volunteer.firstName} ${a.volunteer.lastName}`
                                : 'Unknown Volunteer'}
                            </div>
                            <button
                              onClick={() => unassignVolunteer(a.id)}
                              className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                            >
                              Unassign
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Task Form */}
              <form
                onSubmit={createTask}
                className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Add New Task</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task Name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value, eventId: event.id })}
                    required
                    className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Schedule Time"
                    value={newTask.scheduleTime}
                    onChange={(e) => setNewTask({ ...newTask, scheduleTime: e.target.value })}
                    required
                    className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Required Volunteers"
                    value={newTask.numRequired}
                    onChange={(e) => setNewTask({ ...newTask, numRequired: parseInt(e.target.value) })}
                    required
                    className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Add Task
                </button>
              </form>
              {event.tasks.filter((task) => task.status === 'completed').length > 0 &&(
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">All Completed Tasks</h2>
                <div className="space-y-4">
                  {event.tasks.filter((task) => task.status === 'completed').map((task) => (
                    <div key={task.id} className="p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                      <h3 className="text-lg font-semibold dark:text-white">{task.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Event: {events.find((e) => e.id === task.eventId)?.name || 'Unknown'} | Scheduled: {task.scheduleTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>)}

              {/* Suspended Tasks Section */}
              {event.tasks.filter((task) => task.status === 'suspended').length > 0 &&(
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">All Suspended Tasks</h2>
                <div className="space-y-4">
                  {event.tasks.filter((task) => task.status === 'suspended').map((task) => (
                    <div key={task.id} className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                      <h3 className="text-lg font-semibold dark:text-white">{task.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Event: {events.find((e) => e.id === task.eventId)?.name || 'Unknown'} | Scheduled: {task.scheduleTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>)}
            </div>
          )}
        </div>
      ))}
    </div>
    </Layout>
  );
};

export default TaskPage;
