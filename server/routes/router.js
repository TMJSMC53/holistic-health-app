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
import { userAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(userAuth);
// GET
router.get('/api/fluidIntakeLog', getFluidIntake);
router.get('/api/waterIntakeGoal', getWaterIntakeGoal);

router.get('/currentUser', getCurrentUser);

// POST
router.post('/api/fluid', createFluidIntake);
router.post('/api/waterIntakeGoal', createWaterIntakeGoal);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: '1' });
  // res.redirect('/');
  res.status(201).json({
    message: 'User successfully logged out',
  });
});

// PUT
router.put('/api/fluid/:id', updateFluidIntake);

// DELETE
router.delete('/api/fluid/:id', deleteFluidIntake);

export default router;
