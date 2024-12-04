import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Homepage from '../pages/Homepage';

import Dashboard from '../pages/Dashboard';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from '../pages/About/About';
import Notes from '../pages/Notes/Notes';
import Docs from '../pages/Docs/Docs';
import Fluids from '../pages/Fluids/Fluids';
import QuickLinks from '../pages/QuickLinks/QuickLinks';
import Habits from '../pages/Habits/Habits';
import Habit from '../pages/Habit/Habit';
import { UserState } from '../main.d';
import { HabitData } from '../habits';

const AppRoutes = () => {
  const [user, setUser] = useState<UserState>(undefined);
  const [habits, setHabits] = useState<HabitData[]>([]);

  const isLoggedIn = user !== null;

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

  // Fetch all habits when user is logged in
  useEffect(() => {
    const fetchHabits = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await fetch('/api/habits', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch habits');
        }

        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchHabits();
  }, [isLoggedIn]);

  if (user === undefined) {
    return null;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route
          path="/"
          element={<Homepage setUser={setUser} isLoggedIn={isLoggedIn} />}
        />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/note" element={<Notes />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs user={user} />} />
        <Route path="/fluids" element={<Fluids />} />
        <Route path="/quickLinks" element={<QuickLinks user={user} />} />
        <Route
          path="/habits"
          element={<Habits habits={habits} setHabits={setHabits} user={user} />}
        />
        <Route
          path="/habit/:habitTitle"
          element={<Habit habits={habits} user={user} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;
