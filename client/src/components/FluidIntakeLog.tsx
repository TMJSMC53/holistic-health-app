import { useEffect, useState } from 'react';

export interface LIList {
  _id: string;
  fluidType: string;
  amount: number;
  date: string;
}

const FluidIntakeLog = () => {
  const [fluidList, setFluidList] = useState<LIList[]>([]);

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
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="text-xl uppercase">
            <th>Date</th>
            <th>Fluid Type</th>
            <th>Amount (ml)</th>
          </tr>
        </thead>
        <tbody>
          {fluidList.map((item) => (
            <tr className="bg-indigo-300" key={item._id}>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.fluidType}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FluidIntakeLog;
