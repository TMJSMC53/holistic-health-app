import { useEffect, useState } from 'react';
import FluidIntakeUpdateForm from '../Fluids/FluidIntakeUpdateForm';
import FluidIntakeDeleteForm from '../Fluids/FluidIntakeDeleteForm';

export interface Fluid {
  _id: string;
  fluidType: string;
  amount: number;
  date: string;
}

const FluidIntakeLogDashboardView = () => {
  const [fluidList, setFluidList] = useState<Fluid[]>([]);

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
        setFluidList(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return (
    <>
      <div className="overflow-x-auto ">
        <table className="table table-zebra">
          <thead>
            <tr className="text-14 md:text-18 lg:text-22 text-primary-600 font-playfair">
              <th>Fluid</th>
              <th>ML</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fluidList.slice(0, 5).map((fluid) => (
              <tr
                className="text-12 md:text-16 lg:text-20 bg-accents-200 font-poppins"
                key={fluid._id}
              >
                <td>{fluid.fluidType}</td>
                <td>{fluid.amount}</td>
                <td>
                  {new Date(fluid.date).toLocaleDateString('es-ES', options)}
                </td>
                <td className="flex place-items-center px-0">
                  <FluidIntakeUpdateForm fluid={fluid} />
                  <FluidIntakeDeleteForm fluid={fluid} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </>
  );
};

export default FluidIntakeLogDashboardView;
