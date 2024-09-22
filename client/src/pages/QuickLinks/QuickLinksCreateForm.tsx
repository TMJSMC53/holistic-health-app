import { useState, FormEvent, ChangeEvent } from 'react';
import SuccessModal from '../../components/SuccessModal';
import QuickLinksFavoriteBtn from './QuickLinksFavoriteBtn';

const QuickLinksCreateForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isShowSuccessModalOpen, setIsShowSuccessModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
      await fetch(`/api/quickLinks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          url: url,
          isFavorite: isFavorite,
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

  function handleName(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }
  function handleUrl(event: ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  return (
    <>
      <div>
        <label
          htmlFor="quickLinksAddButton"
          className="md:mb-4 btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
        >
          <span className="md:text-16 text-primary-600 font-poppins font-medium">
            Add Quick Link
          </span>
          <button id="quickLinksAddButton" onClick={handleModalToggle}>
            <svg
              fill="#ff7e67"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 38.342 38.342"
              xmlSpace="preserve"
              stroke="#ff7e67"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M19.171,0C8.6,0,0,8.6,0,19.171C0,29.74,8.6,38.342,19.171,38.342c10.569,0,19.171-8.602,19.171-19.171 C38.342,8.6,29.74,0,19.171,0z M19.171,34.341C10.806,34.341,4,27.533,4,19.17c0-8.365,6.806-15.171,15.171-15.171 s15.171,6.806,15.171,15.171C34.342,27.533,27.536,34.341,19.171,34.341z M30.855,19.171c0,1.656-1.344,3-3,3h-5.685v5.685 c0,1.655-1.345,3-3,3c-1.657,0-3-1.345-3-3v-5.685h-5.684c-1.657,0-3-1.344-3-3c0-1.657,1.343-3,3-3h5.684v-5.683 c0-1.657,1.343-3,3-3c1.655,0,3,1.343,3,3v5.683h5.685C29.512,16.171,30.855,17.514,30.855,19.171z"></path>
                </g>
              </g>
            </svg>
          </button>
        </label>
      </div>

      <div className={` modal ${isModalOpen && 'modal-open'}`} role="dialog">
        <div className="text-18 font-poppins modal-box h-90 md:w-96 overflow-y-hidden px-4">
          <div className="flex justify-between text-20 text-primary-600 mb-4">
            <div>Add Quick Link</div>

            <QuickLinksFavoriteBtn
              isFavorite={isFavorite}
              // this is a React State Setter function
              setIsFavorite={setIsFavorite}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <p className="text-12 md:text-14 text-primary-600 font-poppins font-bold">
                Name
              </p>
              <input
                value={name}
                onChange={handleName}
                className="text-12 md:text-16 text-primary-600 font-poppins border input-borders w-full p-2 mb-4"
                type="string"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-12 md:text-14 text-primary-600 font-poppins font-bold">
                URL
              </p>
              <input
                value={url}
                onChange={handleUrl}
                className="text-12 md:text-16 text-primary-600 font-poppins border input-borders w-full p-2"
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
                Save
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
        <SuccessModal message="Quick Link successfully created" />
      )}
    </>
  );
};

export default QuickLinksCreateForm;
