import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import NotesUpdateForm from '../Notes/NotesUpdateForm';
export interface Notes {
  _id: string;
  date: string;
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
        const response = await fetch(`/api/note`, {
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
        <section className="w-10/12">
          <div className="flex flex-col bg-accents-300 px-4 ">
            {notes.slice(0, 5).map((note) => (
              <div className="flex gap-2 my-4" key={note._id}>
                <div className="flex gap-1">
                  <a
                    className="lg:text-20 cursor-pointer underline hover:underline-offset-4"
                    onClick={() => handleDateClick(note)}
                  >
                    {new Date(note.date).toLocaleDateString()}
                  </a>
                  <span className="text-12 lg:text-14 rounded-full py-0.5 px-2 bg-primary-600 text-accents-100">
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
      </aside>
      <div className="lg:text-20 text-center text-primary-600 my-4 hover:underline hover:scale-125">
        <Link to="/note">View All</Link>
      </div>
    </>
  );
};

export default NotesDashboardView;
