import { FormEvent, ChangeEvent, useState, useEffect, useRef } from 'react';

const CustomizableWaterIntakeGoalForm = () => {
  const [waterGoalAmount, setWaterGoalAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch(`/api/waterIntakeGoal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(waterGoalAmount),
        }),
      });

      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  // Read
  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch('/api/waterIntakeGoal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setWaterGoalAmount(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  // Back btn
  // useEffect(() => {
  //   if (modalIsClosed) return;
  //   const onBackArrow = (e: PopStateEvent) => {};

  //   // include modal open state
  // }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  function handleWaterGoalAmount(event: ChangeEvent<HTMLInputElement>) {
    setWaterGoalAmount(event.target.value);
  }
  return (
    <>
      <div className="tooltip tooltip-left" data-tip="Update Water Intake Goal">
        <label
          htmlFor="gearButton"
          className="btn bg-transparent border-0 shadow-transparent hover:bg-transparent"
        >
          <button id="gearButton" onClick={handleModalToggle}>
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
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </label>
      </div>

      <div className={`modal ${isModalOpen && 'modal-open'}`} role="dialog">
        <div className="modal-box h-64 md:w-1/2 overflow-y-hidden">
          <h3 className="text-22 text-primary-600 font-medium font-poppins">
            Update Water Intake Goal
          </h3>
          <div className="mt-12 mb-12">
            <form onSubmit={handleSubmit}>
              <section className="flex">
                <input
                  ref={inputRef}
                  className="input input-bordered input-sm w-1/2 md:w-1/3 max-w-xs ml-2 mr-1.5"
                  id="water_goal"
                  name="water_goal"
                  value={waterGoalAmount}
                  onChange={handleWaterGoalAmount}
                  placeholder="Amount"
                  type="number"
                />

                <button
                  className="w-auto btn btn-sm btn-accent text-blue"
                  type="submit"
                >
                  Update Goal
                </button>
              </section>
            </form>
          </div>
          <div className="modal-action">
            <label
              htmlFor="modalToggle"
              className="btn text-accents-100 bg-primary-600
              hover:bg-primary-700"
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

export default CustomizableWaterIntakeGoalForm;
