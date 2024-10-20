import Habit from '../models/habit.js';

export const createRecordHabitEnactment = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get the current habit
    const habit = await Habit.findById(habitId);

    // Check if there's already an enactment for today
    const hasEnactmentToday = habit.enactments.some((enactment) => {
      const enactmentDate = new Date(enactment);
      return enactmentDate >= today && enactmentDate < tomorrow;
    });

    if (hasEnactmentToday) {
      return res.status(400).json({
        message: 'Habit already recorded for today',
        habit: habit,
      });
    }

    // If no enactment today, add one
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      {
        $push: { enactments: today.toISOString() },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('Updated habit enactments:', updatedHabit.enactments);
    res.status(200).json(updatedHabit);
  } catch (err) {
    console.error('Error recording habit enactment:', err);
    res.status(500).json({ message: 'Error recording habit enactment' });
  }
};

export const createPlusOneHabitEnactment = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today = new Date();

    // Add the new enactment to the listS
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      {
        $push: { enactments: today.toISOString() },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('Updated habit enactments:', updatedHabit.enactments);
    res.status(200).json(updatedHabit);
  } catch (err) {
    console.error('Error recording habit enactment:', err);
    res.status(500).json({ message: 'Error recording habit enactment' });
  }
};

export const createHabit = async (req, res) => {
  const today = new Date().toISOString();
  const newHabit = new Habit({
    user_id: req.user.id,
    title: req.body.title,
    enactments: [today],
  });
  console.log(newHabit);

  try {
    await newHabit.save();
    console.log(newHabit);
    res.status(201).json(newHabit);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const getHabits = async (req, res) => {
  try {
    const getHabits = await Habit.find({
      user_id: req.user.id,
    });
    res.status(200).json(getHabits);
  } catch (err) {
    if (err) return res.status(500).send(err);
  }
};
