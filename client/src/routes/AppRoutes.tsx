import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';

import Dashboard from '../pages/Dashboard';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

import { UserState } from '../main.d';

const AppRoutes = () => {
  const [user, setUser] = useState<UserState>(undefined);

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch('/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const user = await response.json();
        setUser(user);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Homepage setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
