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
    const timeZoneOffset = req.body.timeZoneOffset;
    const userTimestamp = new Date(req.body.timestamp);

    // Calculate start and end of the user's local day
    const userLocalDate = new Date(
      userTimestamp.getTime() - timeZoneOffset * 60 * 1000
    );
    const startOfDay = new Date(userLocalDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Convert back to UTC for database comparison
    const startOfDayUTC = new Date(
      startOfDay.getTime() + timeZoneOffset * 60 * 1000
    );
    const endOfDayUTC = new Date(
      endOfDay.getTime() + timeZoneOffset * 60 * 1000
    );

    // Get the current habit
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check if there's already an enactment for today in user's local time
    const hasEnactmentToday = habit.enactments.some((enactment) => {
      const enactmentDate = new Date(enactment);
      return enactmentDate >= startOfDayUTC && enactmentDate < endOfDayUTC;
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
  if (!req.user || !req.user.id) {
    return res.status(500).json({
      message: 'User not logged in',
    });
  }
  try {
    const getHabitsList = await Habit.find({ user_id: req.user.id });

    res.status(200).json(getHabitsList);
  } catch (err) {
    handleError(res, err, 'Error fetching habits');
  }
};

// Update a Habit Title
export const updateHabit = async (req, res) => {
  try {
    const id = req.params.id;
    const updateHabitTitle = await Habit.findByIdAndUpdate(
      id,
      { title: req.body.title },
      { new: true }
    );

    if (!updateHabitTitle) {
      return res.status(404).json({ message: 'Habit title not found' });
    }
    res.status(200).json(updateHabitTitle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a Habit
export const deleteHabit = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteHabit = await Habit.findByIdAndDelete(id);

    if (!deleteHabit) {
      return res.status(404).json({
        message: `Entry with id: ${id} not found`,
      });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
