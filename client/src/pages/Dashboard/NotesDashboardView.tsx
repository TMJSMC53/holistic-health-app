import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import NotesUpdateForm from '../Notes/NotesUpdateForm';
import {
  getBorderColor,
  getHoverBackgroundColor,
} from '../../utils/notesUtils';
export interface Notes {
  _id: string;
  date: string;
  title: string;
  color: string;
  note: string;
  tag: string;
}
const NotesDashboardView = () => {
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
    <>
      <aside className="flex justify-center">
        <section className="w-10/12 md:w-full lg:full md:ml-4">
          <div className="flex flex-col bg-accents-500  border-primary-600 border notes-cards-border py-2 px-4 ">
            {notes.slice(0, 5).map((note) => (
              <div className="flex gap-2 my-2" key={note._id}>
                <div className="flex gap-1">
                  <a
                    className="lg:text-20 cursor-pointer"
                    onClick={() => handleDateClick(note)}
                  >
                    <div
                      className={`${getBorderColor(
                        note.color
                      )} text-12 md:text-14 p-2 border-2 rounded-full ${getHoverBackgroundColor(
                        note.color
                      )}`}
                    >
                      {note.title}
                    </div>
                  </a>
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
      </aside>
      <div className="lg:text-20 text-center text-primary-600 my-4 hover:underline hover:scale-125">
        <Link to="/note">View All</Link>
      </div>
    </>
  );
};

export default NotesDashboardView;
