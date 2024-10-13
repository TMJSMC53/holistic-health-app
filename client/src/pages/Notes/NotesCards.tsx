import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import NotesUpdateForm from './NotesUpdateForm';
import { getBackgroundColor } from '../../utils/notesUtils';
export interface Notes {
  _id: string;
  date: string;
  title: string;
  note: string;
  tag: string;
  color: string;
}
const NotesCards = () => {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);

  const handleEditBtnClick = (note: Notes) => {
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
    <section className="mb-4">
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
        {notes.map((note) => (
          <div
            className={`${getBackgroundColor(
              note.color
            )} p-4 notes-cards-border`}
            key={note._id}
          >
            <div className="font-poppins">
              <span className="text-12 flex justify-between items-center cursor-pointer">
                {new Date(note.date).toLocaleDateString()}

                <button onClick={() => handleEditBtnClick(note)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-6  md:h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              </span>
              <h3 className="font-bold my-2">{note.title} </h3>
              <hr className="border-dotted border-t-primary-600" />
              <p className="text-14 my-3">{note.note}</p>
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
    </section>
  );
};

export default NotesCards;
