import { useState, FormEvent, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Textarea from './Textarea';
import NotesDeleteForm from './NotesDeleteForm';
export interface Notes {
  _id: string;
  date: string;
  note: string;
  tag: string;
}
const NotesUpdateForm = ({
  note,
  setSelectedNote,
}: {
  note: Notes;
  setSelectedNote: React.Dispatch<React.SetStateAction<Notes | null>>;
}) => {
  const [startDate, setStartDate] = useState(new Date(note.date));
  const [text, setText] = useState(note.note);
  const [tag, setTag] = useState(note.tag);
  const [isShowSuccessModalOpen, setIsShowSuccessModalOpen] = useState(false);
  const handleDateChange = (date: Date | [Date, Date] | null) => {
    if (date instanceof Date) {
      setStartDate(date);
    }
  };
  const handleCloseNoteModal = () => {
    setSelectedNote(null);
  };
  function handleTag(event: ChangeEvent<HTMLInputElement>) {
    setTag(event.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch(`/api/notes/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: text,
          tag: tag,
          date: startDate,
        }),
      });

      setIsShowSuccessModalOpen(true);
      setTimeout(() => {
        handleCloseNoteModal();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
      <input
        type="checkbox"
        id="modalToggle"
        className="modal-toggle"
        checked={true}
        readOnly
      />
      {/* Success Modal */}
      {isShowSuccessModalOpen && (
        <div className={`modal open`} role="dialog">
          <div className="modal-box">
            <h2>Update Note Successful </h2>
          </div>
          <div className="modal-backdrop"></div>
        </div>
      )}
      <input
        type="checkbox"
        id="modalToggle"
        className="modal-toggle"
        checked={true}
        readOnly
      />
      {!isShowSuccessModalOpen && (
        <div className={`modal open`} role="dialog">
          <div className="modal-box">
            <div className="flex justify-between items-center">
              <div className="flex  items-center gap-2">
                <h3 className="text-14 md:text-18 text-primary-600 font-poppins font-bold mb-0">
                  Date:
                </h3>
                <DatePicker
                  className="text-14  md:text-18 text-primary-600 font-poppins"
                  selected={startDate}
                  onChange={handleDateChange}
                />
              </div>
              <NotesDeleteForm note={note} />
            </div>
            <form onSubmit={handleSubmit}>
              <Textarea initialTextValue={text} setText={setText} />

              <div className="flex gap-2">
                <p className="text-12 md:text-14 text-primary-600 font-poppins font-bold">
                  add tag:
                </p>
                <input
                  value={tag}
                  onChange={handleTag}
                  className="text-12 md:text-16 text-primary-600 font-poppins border w-24"
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
      )}
    </>
  );
};

export default NotesUpdateForm;
