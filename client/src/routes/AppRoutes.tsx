import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage/Homepage';
import Dashboard from '../pages/Dashboard/Dashboard';
import { useState } from 'react';
import Navbar from '../components/Navbar';

const AppRoutes = () => {
  const [user, setUser] = useState<
    | {
        username: string;
        firstName: string;
        lastName: string;
      }
    | undefined
  >(undefined);

  return (
    <BrowserRouter>
      <div>
        <Navbar setUser={setUser} user={user} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
