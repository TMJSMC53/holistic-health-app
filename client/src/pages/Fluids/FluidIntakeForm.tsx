import { ChangeEvent, FormEvent, useState, useEffect } from 'react';

const FluidIntakeForm = () => {
  const [fluidAmount, setFluidAmount] = useState('');
  const [fluidType, setFluidType] = useState('');
  const [fluids, setFluids] = useState([
    'Water',
    'Coffee',
    'Tea',
    'Mineral Water',
    'Juice',
  ]);

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch('/api/fluidIntakes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        const userFluidTypes = data.map((el: any) => el.fluidType);

        const fluidTypesLists: Array<string> = [];
        // add the old option items to the list
        fluidTypesLists.push(...fluids);
        // add the new option items to the list
        fluidTypesLists.push(...userFluidTypes);
        // remove any duplicates
        const list = [...new Set(fluidTypesLists)];

        setFluids(list);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await fetch('/api/fluidIntakes', {
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
              data-testid="fluid-type-input"
            />
            <datalist
              className="sm:w-1/3"
              id="fluids"
              data-testid="fluids-datalist"
            >
              {fluids.map((fluid) => (
                <option key={fluid} value={fluid} />
              ))}
            </datalist>
            <input
              className="input input-bordered input-sm w-1/3 md:w-2/12 max-w-xs mr-1.5"
              value={fluidAmount}
              type="number"
              onChange={handleFluidAmount}
              placeholder="Amount"
            />
            <button className="text-12 lg:text-14 btn btn-sm bg-primary-600 text-accents-100 hover:bg-primary-700 hover:text-accents-100 mr-4">
              Enter Amount
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FluidIntakeForm;
