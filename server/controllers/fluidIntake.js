import FluidIntakeList from '../models/fluidIntakeList.js';

// Create a new FluidIntakeList
export const createFluidIntake = async (req, res) => {
  const newItem = new FluidIntakeList({
    fluidType: req.body.fluidType,
    amount: req.body.amount,
    user_id: req.user.id,
  });
  console.log(newItem);
  try {
    await newItem.save();
    console.log(newItem);
    res.json(newItem);
  } catch (err) {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  }
};

// Read a new FluidIntakeList

export const getFluidIntake = async (req, res) => {
  try {
    const getItems = await FluidIntakeList.find({ user_id: req.user.id });
    res.status(200).send(getItems);

    console.log(getItems);
  } catch (err) {
    if (err) return res.status(500).send(err);
  }
};

// Update a new FluidIntakeList
export const updateFluidIntake = async (req, res) => {
  try {
    const id = req.params.id;
    const updateEntry = await FluidIntakeList.findByIdAndUpdate(
      id,
      {
        fluidType: req.body.fluidType,
        amount: req.body.amount,
      },
      { new: true }
    );
    if (!updateEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).send(updateEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a new FluidIntakeList
export const deleteFluidIntake = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteEntry = await FluidIntakeList.findByIdAndDelete(id);

    if (!deleteEntry) {
      return res.status(404).send(`Entry with id: ${id} not found`);
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
