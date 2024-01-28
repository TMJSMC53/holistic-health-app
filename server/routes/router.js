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

import {} from '../controllers/auth.js';

const router = express.Router();

// GET
router.get('/api/fluidIntakeLog', getFluidIntake);
router.get('/api/waterIntakeGoal', getWaterIntakeGoal);

// POST
router.post('/api/fluid', createFluidIntake);
router.post('/api/waterIntakeGoal', createWaterIntakeGoal);

// PUT
router.put('/api/fluid/:id', updateFluidIntake);

// DELETE
router.delete('/api/fluid/:id', deleteFluidIntake);

export default router;
