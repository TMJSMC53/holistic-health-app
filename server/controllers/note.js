import Note from '../models/note.js';

// Create a new Note
export const createNote = async (req, res) => {
  const newNote = new Note({
    note: req.body.note,
    tag: req.body.tag,
    user_id: req.user.id,
  });
  console.log(newNote);

  try {
    await newNote.save();
    console.log(newNote);
    res.json(newNote);
  } catch (err) {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  }
};

// Read a new Note
export const getNote = async (req, res) => {
  try {
    const getNotes = await Note.find({
      user_id: req.user.id,
    }).sort({
      date: 'desc',
    });
    res.status(200).send(getNotes);
  } catch (err) {
    if (err) return res.status(500).send(err);
  }
};

// Update a Note
export const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const updateNote = await Note.findByIdAndUpdate(
      id,
      {
        note: req.body.note,
        tag: req.body.tag,
        date: req.body.date,
      },
      { new: true }
    );
    if (!updateNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).send(updateNote);
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
      return res.status(404).send(`Entry with id: ${id} not found`);
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
