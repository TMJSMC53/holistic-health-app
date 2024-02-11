import WaterIntakeGoal from '../models/waterIntakeGoal.js';

// Create a new WaterIntakeGoal
export const createWaterIntakeGoal = async (req, res) => {
  const newItem = new WaterIntakeGoal({
    user_id: req.user.id,
    amount: req.body.amount,
  });
  try {
    await newItem.save();
    console.log(newItem);
    res.json(newItem);
  } catch (err) {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  }
};

// Read a new WaterIntakeGoal

export const getWaterIntakeGoal = async (req, res) => {
  try {
    const latestWaterIntakeGoal = await WaterIntakeGoal.findOne({
      user_id: req.user.id,
    }).sort({
      date: 'desc',
    });

    let amount = 4000;
    if (latestWaterIntakeGoal) {
      amount = latestWaterIntakeGoal.amount;
    }
    res.status(200).send({ amount });

    console.log(latestWaterIntakeGoal);
    console.log(amount);
  } catch (err) {
    res.status(500).send(err);
  }
};
