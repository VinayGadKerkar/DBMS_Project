import React, { useState } from 'react';
import { Moon, Sun, UserCircle } from 'lucide-react';

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100"></h2>
      <div className="flex items-center gap-4">
        <button onClick={toggleDark} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-100">
          <UserCircle className="w-6 h-6" />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
