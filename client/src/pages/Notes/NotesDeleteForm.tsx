import { useState } from 'react';
import { Notes } from './NotesAside';

const NotesDeleteForm = ({ note }: { note: Notes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      setIsModalOpen(true);
    }
  };

  async function handleDelete() {
    try {
      await fetch(`/api/note/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
      <div>
        {/* <label
          htmlFor="deleteButton"
          className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
        > */}
        <button id="deleteButton" onClick={handleModalToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
        {/* </label> */}
      </div>

      <div className={`modal ${isModalOpen && 'modal-open'}`} role="dialog">
        <div className="modal-box h-50 md:w-96 overflow-y-hidden px-4">
          <h3 className="text-14 md:text-18 text-primary-600 font-semibold font-poppins mb-10">
            Confirm Delete
          </h3>

          <form onSubmit={handleDelete}>
            <div className="relative flex">
              <label
                className="text-16 text-center text-primary-600 font-poppins font-semibold w-full"
                htmlFor="note"
              >
                Are you sure you want to delete this?
              </label>
              <div className="absolute inset-0">
                <div className="absolute inset-x-0 mt-[-10px] h-0.5 bg-gray-100" />
                <div className="absolute inset-x-0 bottom-0 top-7 h-0.5 bg-gray-100" />
              </div>
            </div>
            <section className="flex justify-between mt-10">
              <div className="modal-action mt-0">
                <label
                  htmlFor="modalToggle"
                  className="btn bg-primary-600 hover:bg-primary-600 text-accents-100 "
                  onClick={handleModalToggle}
                >
                  Cancel
                </label>
              </div>
              <button
                className="btn bg-primary-700 text-accents-100 hover:bg-primary-700"
                type="submit"
              >
                Delete
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
    </>
  );
};

export default NotesDeleteForm;
