import { useState, FormEvent, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Textarea from '../Notes/Textarea';
import SuccessModal from '../../components/SuccessModal';

const NotesCreateForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [isShowSuccessModalOpen, setIsShowSuccessModalOpen] = useState(false);

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
      await fetch(`/api/notes`, {
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
      setIsShowSuccessModalOpen(true);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleDateChange = (date: Date | [Date, Date] | null) => {
    if (date instanceof Date) {
      setStartDate(date);
    }
  };

  function handleTag(event: ChangeEvent<HTMLInputElement>) {
    setTag(event.target.value);
  }

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
        <div className="modal-box h-90 md:w-96 overflow-y-hidden px-4">
          <div className="flex">
            <div className="flex items-center gap-2">
              <h3 className="text-14 md:text-18 text-primary-600 font-poppins mb-0 font-bold">
                Date:
              </h3>
              <DatePicker
                className="text-14 md:text-18 text-primary-600 font-poppins"
                selected={startDate}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Textarea setText={setText} />

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
      {isShowSuccessModalOpen && (
        <SuccessModal message="Note successfully created" />
      )}
    </>
  );
};

export default NotesCreateForm;
