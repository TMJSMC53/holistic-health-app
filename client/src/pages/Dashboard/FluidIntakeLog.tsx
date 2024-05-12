import { useEffect, useState } from 'react';
import FluidIntakeUpdateForm from './FluidIntakeUpdateForm';
import FluidIntakeDeleteForm from './FluidIntakeDeleteForm';
import FluidIntakeByDays from './FluidIntakeByDays';

export interface Fluid {
  _id: string;
  fluidType: string;
  amount: number;
  date: string;
}

const PAGE_SIZE = 15;

const FluidIntakeLog = () => {
  const [fluidList, setFluidList] = useState<Fluid[]>([]);

  // PAGINATION
  const [page, setPage] = useState<number>(0);

  const totalPages = Math.ceil(fluidList.length / PAGE_SIZE) - 1;
  const sliceStart = page * PAGE_SIZE;
  const sliceEnd = sliceStart + PAGE_SIZE;

  const disableLeftArrow = page === 0;
  const disableRightArrow = page === totalPages;

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch('/api/fluidIntakeLog', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setFluidList(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  function handleLeftArrowClick() {
    setPage(Math.max(page - 1, 0));
  }
  function handleRightArrowClick() {
    setPage(Math.min(page + 1, totalPages));
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="text-14 md:text-18 lg:text-22 text-primary-600 uppercase font-playfair">
              <th>Date</th>
              <th>Fluid</th>
              <th>ML</th>
              <th>edit/delete</th>
            </tr>
          </thead>
          <tbody>
            {fluidList.slice(sliceStart, sliceEnd).map((fluid) => (
              <tr
                className="text-12 md:text-16 lg:text-20 bg-accents-200 font-poppins"
                key={fluid._id}
              >
                <td>{new Date(fluid.date).toLocaleDateString()}</td>
                <td>{fluid.fluidType}</td>
                <td>{fluid.amount}</td>
                <td className="flex place-items-center">
                  <FluidIntakeUpdateForm fluid={fluid} />
                  <FluidIntakeDeleteForm fluid={fluid} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <div className="flex mt-2">
              {/* left arrow btn */}
              <button
                className={disableLeftArrow ? `btn-disabled btn-primary` : ''}
                onClick={handleLeftArrowClick}
              >
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
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              {page + 1} / {totalPages + 1}
              {/* right arrow btn */}
              <button
                className={disableRightArrow ? `btn-disabled btn-primary` : ''}
                onClick={handleRightArrowClick}
              >
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </tfoot>
        </table>
        <FluidIntakeByDays />
      </div>
    </>
  );
};

export default FluidIntakeLog;
