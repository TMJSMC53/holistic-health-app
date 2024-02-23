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
            <tr className="text-20 uppercase">
              <th>Date</th>
              <th>Fluid Type</th>
              <th>Amount (ml)</th>
              <th>edit/delete</th>
            </tr>
          </thead>
          <tbody>
            {fluidList.map((fluid) => (
              <tr className="bg-indigo-300" key={fluid._id}>
                <td>{new Date(fluid.date).toLocaleDateString()}</td>
                <td>{fluid.fluidType}</td>
                <td>{fluid.amount}</td>
                <td className="flex items-center">
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
