import QuickLink from '../models/quickLink.js';

// Create a new QuickLink

export const createQuickLink = async (req, res) => {
  const newQuickLink = new QuickLink({
    name: req.body.name,
    url: req.body.url,
    user_id: req.user.id,
  });
  console.log(newQuickLink);

  try {
    await newQuickLink.save();
    console.log(newQuickLink);
    res.status(201).json(newQuickLink);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Read a new QuickLink
export const getQuickLinks = async (req, res) => {
  try {
    const getQuickLinks = await QuickLink.find({
      user_id: req.user.id,
    });
    res.status(200).json(getQuickLinks);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update a QuickLink
export const updateQuickLink = async (req, res) => {
  try {
    const id = req.params.id;
    const updateLink = await QuickLink.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        url: req.body.url,
      },
      { new: true }
    );

    if (!updateLink) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.status(200).json(updateLink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a QuickLink

export const deleteQuickLink = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteQuickLink = await QuickLink.findByIdAndDelete(id);

    if (!deleteQuickLink) {
      res.status(404).json({ message: `QuickLink with id: ${id} not found` });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
