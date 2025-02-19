import Note from '../models/note.js';

// Helper function for error handling
const handleError = (res, err, message = 'Server error') => {
  console.error(message, err);
  return res.status(500).json({ message });
};

// Create a new Note
export const createNote = async (req, res) => {
  const newNote = new Note({
    note: req.body.note,
    title: req.body.title,
    tag: req.body.tag,
    color: req.body.color,
    user_id: req.user.id,
  });

  try {
    await newNote.save();

    res.status(201).json(newNote);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// Read a new Note
export const getNotes = async (req, res) => {
  try {
    const getNotes = await Note.find({
      user_id: req.user.id,
    }).sort({
      date: 'desc',
    });
    res.status(200).json(getNotes);
  } catch (err) {
    handleError(res, err, 'User not logged in');
  }
};

// Update a Note
export const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const updateNote = await Note.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        note: req.body.note,
        tag: req.body.tag,
        date: req.body.date,
        color: req.body.color,
      },
      { new: true }
    );
    if (!updateNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updateNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a Note
export const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteNote = await Note.findByIdAndDelete(id);

    if (!deleteNote) {
      return res
        .status(404)
        .json({ message: `Entry with id: ${id} not found` });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
