import Note from '../models/Note.js';

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

// Read a new FluidIntakeList
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
