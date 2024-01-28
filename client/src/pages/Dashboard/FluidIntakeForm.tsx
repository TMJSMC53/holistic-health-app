import { ChangeEvent, FormEvent, useState } from 'react';

const FluidIntakeForm = () => {
  const [fluidAmount, setFluidAmount] = useState('');
  const [fluidType, setFluidType] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch('/api/fluid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fluidType: fluidType, amount: fluidAmount }),
      });

      const fluidIntakeDoc = await response.json();
      alert(`You entered ${fluidIntakeDoc.amount}`);
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
      <div className="mt-24 mb-12">
        <form onSubmit={handleSubmit}>
          <label htmlFor="fluidType">Choose a fluid type from this list:</label>
          <input
            className="input input-bordered input-sm w-2/12 max-w-xs ml-2 mr-1.5"
            list="fluids"
            id="fluidType"
            name="fluidType"
            value={fluidType}
            onChange={handleFluidType}
            type="string"
          />
          <datalist id="fluids">
            <option value="Water"></option>
            <option value="Coffee"></option>
            <option value="Tea"></option>
            <option value="Carbonated Water"></option>
            <option value="Juice"></option>
          </datalist>
          <input
            className="input input-bordered input-sm w-2/12 max-w-xs mr-1.5"
            value={fluidAmount}
            type="number"
            onChange={handleFluidAmount}
            placeholder="Amount"
          />
          <button className="btn btn-sm btn-accent text-blue">
            Enter Amount
          </button>
        </form>
      </div>
    </>
  );
};

export default FluidIntakeForm;
