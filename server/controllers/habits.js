import Habit from '../models/habit.js';

// Helper function for error handling
const handleError = (res, err, message = 'Server error') => {
  console.error(message, err);
  return res.status(500).json({ message });
};

// Helper function for habit updates
const updateHabitEnactment = async (habitId, date) => {
  return Habit.findByIdAndUpdate(
    habitId,
    { $push: { enactments: date.toISOString() } },
    { new: true, runValidators: true }
  );
};

export const createRecordHabitEnactment = async (req, res) => {
  try {
    const habitId = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Define tomorrow (start of the next day)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

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

    // Add the new enactment with the current timestamp (not just date)
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      {
        $push: { enactments: new Date().toISOString() },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedHabit);
  } catch (err) {
    console.error('Error recording habit enactment:', err);
    res.status(500).json({ message: 'Error recording habit enactment' });
  }
};

export const createPlusOneHabitEnactment = async (req, res) => {
  try {
    const updatedHabit = await updateHabitEnactment(req.params.id, new Date());
    res.status(200).json(updatedHabit);
  } catch (err) {
    handleError(res, err, 'Error recording habit enactment');
  }
};

export const createHabit = async (req, res) => {
  try {
    const query = Habit.where({ title: req.body.title, user_id: req.user.id });
    const existingHabit = await query.findOne();
    if (existingHabit) {
      return res.status(409).json({
        message: 'Habit already exists',
      });
    }
    const habit = new Habit({
      user_id: req.user.id,
      title: req.body.title,
      enactments: [new Date().toISOString()],
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    handleError(res, err, 'Error creating habit');
  }
};

export const getHabits = async (req, res) => {
  if (!req.user || !req.user.id) return;
  try {
    const getHabitsList = await Habit.find({ user_id: req.user.id });

    res.status(200).json(getHabitsList);
  } catch (err) {
    handleError(res, err, 'Error fetching habits');
  }
};
