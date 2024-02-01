import { FormEvent, ChangeEvent, useState } from 'react';

import { Fluid } from "./FluidIntakeLog"

const FluidIntakeUpdateForm = ({ fluid } : { fluid: Fluid }) => {
  const [fluidAmount, setFluidAmount] = useState(fluid.amount);
  const [fluidType, setFluidType] = useState(fluid.fluidType);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/fluid/${fluid._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fluidType: fluidType,
          amount: fluidAmount,
        }),
      });

      const fluidIntakeDoc = await response.json();
      alert(`You updated the current amount to: ${fluidIntakeDoc.amount}`);
      setIsModalOpen(false);
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
            className="w-6 h-6"
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
          <div className="mt-24 mb-12">
            <form onSubmit={handleSubmit}>
              <label htmlFor="fluidType">
                Choose a fluid type from this list:
              </label>
              <input
                className="input input-bordered input-sm w-2/12 max-w-xs ml-2 mr-1.5"
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
                <option key="carbonatedWater" value="Carbonated Water"></option>
                <option key="juice" value="Juice"></option>
              </datalist>
              <input
                className="input input-bordered input-sm w-2/12 max-w-xs mr-1.5"
                value={fluidAmount}
                type="number"
                onChange={handleFluidAmount}
                placeholder="Amount"
              />
              <button className="btn btn-sm btn-accent text-blue" type="submit">
                Update
              </button>
            </form>
          </div>
          <div className="modal-action">
            <label
              htmlFor="modalToggle"
              className="btn"
              onClick={handleModalToggle}
            >
              Close!
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default FluidIntakeUpdateForm;
