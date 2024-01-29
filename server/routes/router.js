import express from 'express';
import {
  createFluidIntake,
  getFluidIntake,
  updateFluidIntake,
  deleteFluidIntake,
} from '../controllers/fluidIntake.js';

import {
  createWaterIntakeGoal,
  getWaterIntakeGoal,
} from '../controllers/waterIntakeGoal.js';

import { register, login, getCurrentUser } from '../controllers/auth.js';

const router = express.Router();

// GET
router.get('/api/fluidIntakeLog', getFluidIntake);
router.get('/api/waterIntakeGoal', getWaterIntakeGoal);

router.get('/currentUser', getCurrentUser);
router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: '1' });
  res.redirect('/');
});
// POST
router.post('/api/fluid', createFluidIntake);
router.post('/api/waterIntakeGoal', createWaterIntakeGoal);

router.post('/register', register);
router.post('/login', login);

// PUT
router.put('/api/fluid/:id', updateFluidIntake);

// DELETE
router.delete('/api/fluid/:id', deleteFluidIntake);

export default router;
