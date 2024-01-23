import WaterIntakeGoal from '../models/waterIntakeGoal.js';

// Create a new WaterIntakeGoal
export const createWaterIntakeGoal = async (req, res) => {
  const newItem = new WaterIntakeGoal({
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
    const latestWaterIntakeGoal = await WaterIntakeGoal.findOne().sort({
      date: 'asc',
    });

    let amount = 4000;
    if (latestWaterIntakeGoal) {
      amount = latestWaterIntakeGoal.amount;
    }
    res.status(200).send(latestWaterIntakeGoal);

    console.log(latestWaterIntakeGoal);
    console.log(amount);
  } catch (err) {
    res.status(500).send(err);
  }
};
