import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Building2, Users, CalendarDays, ClipboardList, Star, Link2, CheckSquare,
} from 'lucide-react';

const links = [
  { to: '/organizations', label: 'Organizations', icon: Building2 },
  { to: '/volunteers', label: 'Volunteers', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/assignments', label: 'Assignments', icon: Link2 },
  { to: '/attendance', label: 'Attendance', icon: CheckSquare },
];

const Sidebar = () => (
  <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-4">
    <Link to={'/'}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">VMS</h1>
    </Link>
    <nav className="space-y-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
