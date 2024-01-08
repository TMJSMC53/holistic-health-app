import express from 'express';
import {
  createFluidIntake,
  getFluidIntake,
} from '../controllers/fluidIntake.js';

const router = express.Router();

// GET
router.get('/message', (_, res) => res.send('Hello from express!'));
router.get('/users', (_, res) => res.send('Hello users!'));

router.get('/api/fluidIntakeLog', getFluidIntake);

// POST
router.post('/api/fluid', createFluidIntake);
// router.post('/api/fluid/:id', updateFluidIntake);

// DELETE
// router.delete('/api/fluid/:id', deleteFluidIntake);

export default router;
