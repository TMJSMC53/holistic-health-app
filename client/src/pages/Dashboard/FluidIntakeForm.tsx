import { ChangeEvent, FormEvent, useState } from 'react';

const FluidIntakeForm = () => {
  const [fluidAmount, setFluidAmount] = useState('');
  const [fluidType, setFluidType] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await fetch('/api/fluid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fluidType: fluidType, amount: fluidAmount }),
      });

      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleFluidType(event: ChangeEvent<HTMLInputElement>) {
    setFluidType(event.target.value);
  }
  function handleFluidAmount(event: ChangeEvent<HTMLInputElement>) {
    setFluidAmount(event.target.value);
  }
  return (
    <>
      <div className="mt-6 mb-12 w-full">
        <form onSubmit={handleSubmit}>
          <label className="ml-4 font-poppins font-light" htmlFor="fluidType">
            Choose a fluid type from the list below:
          </label>
          <div className="flex sm:flex-none mt-4 font-poppins">
            <input
              className="w-1/3 input input-bordered input-sm max-w-xs ml-4 mr-1.5"
              list="fluids"
              id="fluidType"
              name="fluidType"
              value={fluidType}
              onChange={handleFluidType}
              type="string"
            />
            <datalist className="sm:w-1/3" id="fluids">
              <option value="Water"></option>
              <option value="Coffee"></option>
              <option value="Tea"></option>
              <option value="Mineral Water"></option>
              <option value="Juice"></option>
            </datalist>
            <input
              className="input input-bordered input-sm w-1/3 md:w-2/12 max-w-xs mr-1.5"
              value={fluidAmount}
              type="number"
              onChange={handleFluidAmount}
              placeholder="Amount"
            />
            <button className="text-12 lg:text-14 btn btn-sm bg-primary-600 text-accents-100 hover:bg-accents-300 hover:text-primary-600 mr-4">
              Enter Amount
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FluidIntakeForm;
