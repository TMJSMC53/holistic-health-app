import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Textarea from './Textarea';
import NotesUpdateForm from './NotesUpdateForm';
import NotesDeleteForm from './NotesDeleteForm';

export interface Notes {
  _id: string;
  date: string;
  note: string;
  tag: string;
}

const Notes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');

  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);

  const handleModalToggle = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      setIsModalOpen(true);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch(`/api/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: text,
          tag: tag,
        }),
      });
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

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

  const handleDateChange = (date: Date | [Date, Date] | null) => {
    if (date instanceof Date) {
      setStartDate(date);
    }
  };

  function handleTag(event: ChangeEvent<HTMLInputElement>) {
    setTag(event.target.value);
  }

  const handleDateClick = (note: Notes) => {
    setSelectedNote(note);
  };
  return (
    <>
      <div>
        <label
          htmlFor="addButton"
          className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
        >
          <button id="addButton" onClick={handleModalToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>
          <span>New Note</span>
        </label>
      </div>

      <div className={`modal ${isModalOpen && 'modal-open'}`} role="dialog">
        <div className="modal-box h-96 md:w-96 overflow-y-hidden px-4">
          <div className="flex">
            <div className="flex items-center gap-2">
              <h3 className="text-16 md:text-18 text-primary-600 font-poppins mb-0">
                Date:
              </h3>
              <DatePicker
                className="text-14 font-poppins"
                selected={startDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <NotesUpdateForm />
            <NotesDeleteForm />
          </div>
          <form onSubmit={handleSubmit}>
            <Textarea setText={setText} />

            <div className="flex gap-2">
              <p className="text-12 font-poppins">add tag:</p>
              <input
                value={tag}
                onChange={handleTag}
                className="border w-24"
                type="string"
              />
            </div>
            <section className="flex justify-end gap-2 mt-10">
              <div className="modal-action mt-0">
                <label
                  htmlFor="modalToggle"
                  className="btn bg-primary-600 hover:bg-primary-600 text-accents-100 "
                  onClick={handleModalToggle}
                >
                  Cancel
                </label>
              </div>
              <button className="btn bg-primary-700 text-accents-100 hover:bg-primary-700">
                Add Note
              </button>
            </section>
          </form>
        </div>
        <div className="modal-backdrop">
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
      <aside className="flex justify-end mr-6">
        <div className="max-w-xl  bg-accents-300 px-4 ">
          <p className="text-18 font-poppins">Notes:</p>
          {notes.map((note) => (
            <div
              className="flex gap-2 mb-4"
              key={note._id}
              onClick={() => handleDateClick(note)}
            >
              <div className="flex gap-1">
                <a>{new Date(note.date).toLocaleDateString()}</a>
                <span className="text-12 rounded-full py-0.5 px-2 bg-primary-600 text-accents-100">
                  {note.tag}
                </span>
              </div>
            </div>
          ))}

          {selectedNote && (
            <div>
              <p>Date: {new Date(selectedNote.date).toLocaleDateString()}</p>
              <p>Note: {selectedNote.note}</p>
              <p>Tag: {selectedNote.tag}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Notes;
