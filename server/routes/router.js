import express from 'express';

// Fluids
import {
  createFluidIntake,
  getFluidIntake,
  updateFluidIntake,
  deleteFluidIntake,
} from '../controllers/fluidIntakes.js';

// Water Intake Goal
import {
  createWaterIntakeGoal,
  getWaterIntakeGoal,
} from '../controllers/waterIntakeGoal.js';

// Notes
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from '../controllers/notes.js';

// Quick Links

import {
  createQuickLink,
  getQuickLinks,
  updateQuickLink,
  deleteQuickLink,
} from '../controllers/quickLinks.js';

import {
  createRecordHabitEnactment,
  createPlusOneHabitEnactment,
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from '../controllers/habits.js';

// Auth
import { register, login, getCurrentUser } from '../controllers/auth.js';
import { userAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(userAuth);

// FLUID INTAKES Routes

router.get('/api/fluidIntakes', getFluidIntake);

router.post('/api/fluidIntakes', createFluidIntake);

router.put('/api/fluidIntakes/:id', updateFluidIntake);

router.delete('/api/fluidIntakes/:id', deleteFluidIntake);

// WATER INTAKE GOALS Routes
router.get('/api/waterIntakeGoal', getWaterIntakeGoal);
router.post('/api/waterIntakeGoal', createWaterIntakeGoal);

router.get('/currentUser', getCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: '1' });
  res.status(201).json({
    message: 'User successfully logged out',
  });
});

// NOTES Routes

router.get('/api/notes', getNotes);

router.post('/api/notes', createNote);

router.put('/api/notes/:id', updateNote);

router.delete('/api/notes/:id', deleteNote);

// QUICK LINKS Routes
router.post('/api/quickLinks', createQuickLink);
router.get('/api/quickLinks', getQuickLinks);
router.put('/api/quickLinks/:id', updateQuickLink);
router.delete('/api/quickLinks/:id', deleteQuickLink);

// HABITS Routes
router.post('/api/habits/:id/enactments', createRecordHabitEnactment);
router.post('/api/habits/:id/enactments/plusOne', createPlusOneHabitEnactment);
router.post('/api/habits', createHabit);
router.get('/api/habits', getHabits);
router.put('/api/habits/:id', updateHabit);
router.delete('/api/habits/:id', deleteHabit);

// route to get the Zenquote of the day

router.get('/api/daily-quotes', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/today');

    const data = await response.json();
    res.status(200).json({
      quote: data[0].q,
      author: data[0].a,
    });
  } catch (error) {
    console.error('Error fetching the daily quote:', error);
    res.status(500).json({ error: 'Failed to fetch daily quote' });
  }
});
export default router;
