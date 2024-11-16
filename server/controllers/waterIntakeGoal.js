import WaterIntakeGoal from '../models/waterIntakeGoal.js';

// Create a new WaterIntakeGoal
export const createWaterIntakeGoal = async (req, res) => {
  const newItem = new WaterIntakeGoal({
    user_id: req.user.id,
    amount: req.body.amount,
  });
  try {
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  }
};

// Read a new WaterIntakeGoal

export const getWaterIntakeGoal = async (req, res) => {
  try {
    const allWaterIntakeGoals = await WaterIntakeGoal.find({
      user_id: req.user.id,
    }).sort({
      date: 'desc',
    });

    res.status(200).send(allWaterIntakeGoals);
  } catch (err) {
    res.status(500).send(err);
  }
};
