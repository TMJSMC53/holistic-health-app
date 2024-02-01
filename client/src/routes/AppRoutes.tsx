import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import HomepageLoginForm from '../pages/Homepage/HomepageLoginForm';
import Dashboard from '../pages/Dashboard';
import { useState } from 'react';
import Navbar from '../components/Navbar';

import { User } from "../main.d"

const AppRoutes = () => {
  const [user, setUser] = useState<User|null>(null);

  return (
    <BrowserRouter>
      <div>
        <Navbar setUser={setUser} user={user} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/login" element={<HomepageLoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
