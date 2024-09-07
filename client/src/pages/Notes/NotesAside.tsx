import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import NotesUpdateForm from './NotesUpdateForm';
export interface Notes {
  _id: string;
  date: string;
  note: string;
  tag: string;
}
const NotesAside = () => {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);

  const handleDateClick = (note: Notes) => {
    setSelectedNote(note);
  };

  useEffect(() => {
    const getNotesList = async () => {
      try {
        const response = await fetch(`/api/notes`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getNotesList();
  }, []);

  return (
    <aside className="flex justify-end mr-6">
      <div className="max-w-xl  bg-accents-300 px-4 ">
        <p className="text-18 font-poppins">Notes:</p>

        {notes.map((note) => (
          <div className="flex gap-2 mb-4" key={note._id}>
            <div className="flex gap-1">
              <a
                className="cursor-pointer underline hover:underline-offset-4"
                onClick={() => handleDateClick(note)}
              >
                {new Date(note.date).toLocaleDateString()}
              </a>
              <span className="text-12 rounded-full py-0.5 px-2 bg-primary-600 text-accents-100">
                {note.tag}
              </span>
            </div>
          </div>
        ))}
        {selectedNote && (
          <NotesUpdateForm
            note={selectedNote}
            setSelectedNote={setSelectedNote}
          />
        )}
      </div>
    </aside>
  );
};

export default NotesAside;
