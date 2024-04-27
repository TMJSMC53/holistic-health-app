import { useState } from 'react';

export interface Notes {
  _id: string;
  date: string;
  note: string;
  tag: string;
}
const NotesUpdateForm = ({ note }: { note: Notes | null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
  };
  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   try {
  //     await fetch(`/api/note/${note._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         // fluidType: fluidType,
  //         // amount: fluidAmount,
  //       }),
  //     });

  //     setIsModalOpen(false);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }
  return (
    <>
      <label
        htmlFor="editButton"
        className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
      >
        <button
          className="underline bg-red-500"
          id="editButton"
          onClick={handleModalToggle}
        ></button>
        {isModalOpen && (
          <div className="modal" role="dialog">
            <div className="modal-box">
              <h3>Edit Note</h3>
              <textarea defaultValue={note?.note}></textarea>
              <button onClick={handleSubmit}>Update</button>
              <button onClick={handleModalToggle}>Cancel</button>
            </div>
            <div className="modal-backdrop" onClick={handleModalToggle}></div>
          </div>
        )}
      </label>
    </>
  );
};

export default NotesUpdateForm;
