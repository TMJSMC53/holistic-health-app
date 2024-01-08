import FluidIntakeList from '../models/fluidIntakeList.js';

// Create a new FluidIntakeList
export const createFluidIntake = async (req, res) => {
  const newItem = new FluidIntakeList({
    fluidType: req.body.fluidType,
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

// Read a new FluidIntakeList

export const getFluidIntake = async (req, res) => {
  try {
    const getItems = await FluidIntakeList.find();
    res.status(200).send(getItems);

    console.log(getItems);
  } catch (err) {
    if (err) return res.status(500).send(err);
  }
};

// Update a new FluidIntakeList

// Delete a new FluidIntakeList

function sumOfMinimums(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    const minNum = Math.min(...arr[i]);
    total += minNum;
  }
  return total;
}

console.log(
  sumOfMinimums([
    [3, 5, 15, 20],
    [5, 6, 7, 8, 9],
    [20, 21, 34, 56, 100],
  ])
);
