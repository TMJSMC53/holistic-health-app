import express from 'express';
import {
  createFluidIntake,
  getFluidIntake,
  updateFluidIntake,
  deleteFluidIntake,
} from '../controllers/fluidIntakes.js';

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
  // res.redirect('/');
});

// NOTES Routes

router.get('/api/notes', getNotes);

router.post('/api/notes', createNote);

router.put('/api/notes/:id', updateNote);

router.delete('/api/notes/:id', deleteNote);

export default router;
