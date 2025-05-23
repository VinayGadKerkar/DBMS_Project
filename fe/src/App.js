import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/OrganizationPage';
import Volunteers from './pages/VolunteerPage';
import Events from './pages/Event';
import Tasks from './pages/Tasks';
// import Skills from './pages/Skills';
import Assignments from './pages/Assignment';
import Attendance from './pages/Attendance';
import Layout from './components/Layout';

function App() {
  return (
  

    
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/organizations" element={<Organizations />}></Route>
        <Route path="/events" element={<Events />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/assignments" element={<Assignments />}></Route>
        {/* } />
        
        
        
        <Route path="/skills" element={<Skills />} />
        <Route path="/assignments" element={<Assignments />} />
        */}
      </Routes> 
    </Router>
    
  );
}

export default App;
