import { FormEvent, ChangeEvent, useState, useRef, useEffect } from 'react';

import { Fluid } from './FluidIntakeLog';

const FluidIntakeUpdateForm = ({ fluid }: { fluid: Fluid }) => {
  const [fluidAmount, setFluidAmount] = useState(fluid.amount);
  const [fluidType, setFluidType] = useState(fluid.fluidType);
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
      await fetch(`/api/fluid/${fluid._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fluidType: fluidType,
          amount: fluidAmount,
        }),
      });

      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleFluidType(event: ChangeEvent<HTMLInputElement>) {
    setFluidType(event.target.value);
  }

  function handleFluidAmount(event: ChangeEvent<HTMLInputElement>) {
    setFluidAmount(parseFloat(event.target.value));
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
        htmlFor="editButton"
        className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
      >
        <button id="editButton" onClick={handleModalToggle}>
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
          <div className="my-12">
            <form onSubmit={handleSubmit}>
              <label className="text-18 font-medium w-full" htmlFor="fluidType">
                Update your fluid
              </label>
              <section className="flex mt-6">
                <input
                  ref={inputRef}
                  className="input input-bordered input-sm w-1/3 max-w-xs ml-2 mr-1.5"
                  list="fluids"
                  id="fluidType"
                  name="fluidType"
                  value={fluidType}
                  onChange={handleFluidType}
                  type="text"
                />
                <datalist id="fluids">
                  <option key="water" value="Water"></option>
                  <option key="coffee" value="Coffee"></option>
                  <option key="tea" value="Tea"></option>
                  <option key="mineralWater" value="Mineral Water"></option>
                  <option key="juice" value="Juice"></option>
                  <option key="other" value="Other"></option>
                </datalist>

                <input
                  className="input input-bordered input-sm w-1/3 max-w-xs mr-1.5"
                  value={fluidAmount}
                  type="number"
                  onChange={handleFluidAmount}
                  placeholder="Amount"
                />
                <button
                  className="w-1/3 btn btn-sm btn-accent text-blue"
                  type="submit"
                >
                  Update
                </button>
              </section>
            </form>
          </div>
          <div className="modal-action">
            <label
              htmlFor="modalToggle"
              className="btn bg-primary-600 text-accents-100 hover:bg-primary-700"
              onClick={handleModalToggle}
            >
              Close
            </label>
          </div>
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

export default FluidIntakeUpdateForm;
