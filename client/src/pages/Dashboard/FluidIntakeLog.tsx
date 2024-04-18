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

const FluidIntakeLog = () => {
  const [fluidList, setFluidList] = useState<Fluid[]>([]);

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
            {fluidList.slice(0, 15).map((fluid) => (
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
        </table>
        <FluidIntakeByDays />
      </div>
    </>
  );
};

export default FluidIntakeLog;
