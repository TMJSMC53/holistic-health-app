import { FormEvent, ChangeEvent, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export interface Habits {
  _id: string;
  title: string;
  enactments: string[];
}
const HabitUpdateForm = ({
  habit,
  isOnHabitPage,
}: {
  habit: Habits;
  isOnHabitPage: boolean;
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(habit.title);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const response = await fetch(`/api/habits/${habit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: name,
        }),
      });

      const updatedHabit = await response.json();
      setName(updatedHabit.title);

      setIsModalOpen(false);
      if (isOnHabitPage) {
        navigate(`/habit/${updatedHabit.title}`);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleTitle(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  // Back btn
  useEffect(() => {
    const onBackArrow = () => {
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('popstate', onBackArrow);

    return () => {
      window.removeEventListener('popstate', onBackArrow);
    };
  }, [isModalOpen]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <label
        htmlFor="editHabitUpdateButton"
        className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent px-0"
        aria-label="Edit habit icon"
      >
        <button id="editHabitUpdateButton" onClick={handleModalToggle}>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </label>

      <input
        type="checkbox"
        id="modalToggle"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />

      <div className={`modal${isModalOpen ? ' open' : ''}`} role="dialog">
        <div className="modal-box">
          <div className="my-6">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <label
                  className="text-20 font-poppins font-light w-full "
                  htmlFor="title"
                >
                  Update your habit title
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-12 md:text-14 text-primary-600 font-poppins font-bold mt-6">
                  Title
                </p>
                <input
                  className="text-12 md:text-16 text-primary-600 font-poppins border input-borders w-full p-2 mb-4"
                  value={name}
                  onChange={handleTitle}
                  type="string"
                />
              </div>

              <section className="flex justify-end gap-2 mt-10">
                <div className="modal-action mt-0">
                  <button
                    className="btn bg-primary-600 hover:bg-primary-600 text-accents-100 "
                    onClick={handleModalToggle}
                  >
                    Cancel
                  </button>
                </div>
                <button className="btn bg-primary-700 text-accents-100 hover:bg-primary-700">
                  Save
                </button>
              </section>
            </form>
          </div>
        </div>
        <div className="modal-backdrop">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default HabitUpdateForm;
