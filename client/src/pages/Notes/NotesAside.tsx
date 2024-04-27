import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Textarea from './Textarea';
export interface Notes {
  _id: string;
  date: string;
  note: string;
  tag: string;
}
const NotesAside = () => {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const handleDateClick = (note: Notes) => {
    setSelectedNote(note);
    setTag(note.tag);
    setText(note.note);
    setStartDate(new Date(note.date));
  };

  const handleCloseNoteModal = () => {
    setSelectedNote(null);
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
      handleCloseNoteModal();
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
          <>
            <input
              type="checkbox"
              id="modalToggle"
              className="modal-toggle"
              checked={true}
              readOnly
            />

            <div className={`modal open`} role="dialog">
              <div className="modal-box">
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
                <form onSubmit={handleSubmit}>
                  <Textarea initialTextValue={text} setText={setText} />

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
                        onClick={handleCloseNoteModal}
                      >
                        Cancel
                      </label>
                    </div>
                    <button className="btn bg-primary-700 text-accents-100 hover:bg-primary-700">
                      Update Note
                    </button>
                  </section>
                </form>
              </div>
              <div className="modal-backdrop">
                <button type="button" onClick={handleCloseNoteModal}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default NotesAside;
