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

  const JSONToFile = (obj: any, filename: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <button
        className="text-14 flex justify-self-end items-center gap-1 font-poppins mx-4 mb-2"
        onClick={() => JSONToFile({ notes: notes }, 'myNotes')}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          fill="#000000"
          className="w-6 h-6 md:w-6  md:h-6"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <defs>
              <path
                id="download-a"
                d="M4.29289322,1.70710678 C3.90236893,1.31658249 3.90236893,0.683417511 4.29289322,0.292893219 C4.68341751,-0.0976310729 5.31658249,-0.0976310729 5.70710678,0.292893219 L7.70710678,2.29289322 C8.09763107,2.68341751 8.09763107,3.31658249 7.70710678,3.70710678 C7.31658249,4.09763107 6.68341751,4.09763107 6.29289322,3.70710678 L4.29289322,1.70710678 Z M0,8 L16,8 L16,10 L0,10 L0,8 Z"
              ></path>
              <path
                id="download-c"
                d="M11,9.58578644 L13.2928932,7.29289322 C13.6834175,6.90236893 14.3165825,6.90236893 14.7071068,7.29289322 C15.0976311,7.68341751 15.0976311,8.31658249 14.7071068,8.70710678 L10.7071068,12.7071068 C10.3165825,13.0976311 9.68341751,13.0976311 9.29289322,12.7071068 L5.29289322,8.70710678 C4.90236893,8.31658249 4.90236893,7.68341751 5.29289322,7.29289322 C5.68341751,6.90236893 6.31658249,6.90236893 6.70710678,7.29289322 L9,9.58578644 L9,0.998529185 C9,0.447056744 9.44771525,-7.95978809e-15 10,-7.99360578e-15 C10.5522847,-8.02742346e-15 11,0.447056744 11,0.998529185 L11,9.58578644 Z M18,16 L18,10 C18,9.44771525 18.4477153,9 19,9 C19.5522847,9 20,9.44771525 20,10 L20,17 C20,17.5522847 19.5522847,18 19,18 L1,18 C0.44771525,18 0,17.5522847 0,17 L0,10 C0,9.44771525 0.44771525,9 1,9 C1.55228475,9 2,9.44771525 2,10 L2,16 L18,16 Z"
              ></path>
            </defs>
            <g fill="none" fill-rule="evenodd" transform="translate(2 3)">
              <g transform="translate(2 6)">
                <mask id="download-b" fill="#ffffff">
                  <use xlinkHref="#download-a"></use>
                </mask>
                <use
                  fill="#D8D8D8"
                  fill-rule="nonzero"
                  xlinkHref="#download-a"
                ></use>
                <g fill="#42b883" mask="url(#download-b)">
                  <rect
                    width="24"
                    height="24"
                    transform="translate(-4 -9)"
                  ></rect>
                </g>
              </g>
              <mask id="download-d" fill="#ffffff">
                <use xlinkHref="#download-c"></use>
              </mask>
              <use
                fill="#000000"
                fill-rule="nonzero"
                xlinkHref="#download-c"
              ></use>
              <g fill="#ff7e67" mask="url(#download-d)">
                <rect
                  width="24"
                  height="24"
                  transform="translate(-2 -3)"
                ></rect>
              </g>
            </g>
          </g>
        </svg>
        Export Notes
      </button>
      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4 px-4">
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
