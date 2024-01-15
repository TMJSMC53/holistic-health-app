import React, { useEffect, useState } from 'react';

export interface LIList {
  _id: string;
  fluidType: string;
  amount: number;
  date: string;
}

const FluidIntakeByDays: React.FC = () => {
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

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFluidList(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  const waterList = fluidList.filter((item) => item.fluidType === 'Water');

  const totalWaterAmount = waterList.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const groupedAndSummed: {
    date: string;
    totalAmount: number;
    group: LIList[];
  }[] = Object.entries(
    waterList.reduce<Record<string, { totalAmount: number; group: LIList[] }>>(
      (acc, item) => {
        const days = new Date(item.date);
        const formattedDate = days.toLocaleDateString();

        if (!acc[formattedDate]) {
          acc[formattedDate] = { totalAmount: 0, group: [] };
        }

        acc[formattedDate].totalAmount += item.amount;
        acc[formattedDate].group.push(item);
        return acc;
      },
      {}
    )
  ).map(([date, { totalAmount, group }]) => ({ date, totalAmount, group }));

  return (
    <>
      <div className="flex flex-col">
        <h2 className="mx-auto">Total Water Amount</h2>
        <div className="mx-auto">
          <p>{totalWaterAmount}</p>
        </div>
      </div>
      {groupedAndSummed.map(({ date, totalAmount, group }, index) => (
        <div className="flex flex-col" key={index}>
          <h2 className="mx-auto">Date: {date}</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="text-sm uppercase">
                  <th>Fluid Type</th>
                  <th>Amount (ml)</th>
                </tr>
              </thead>
              <tbody>
                {group.map((item) => (
                  <tr key={item._id}>
                    <td>{item.fluidType}</td>
                    <td>{item.amount}</td>
                    <td></td>
                  </tr>
                ))}
                <tr>
                  <td>Total:</td>
                  {totalAmount < 4000 ? (
                    <p>{`You've drunk ${totalAmount} so far. You still need ${
                      totalAmount - 4000
                    } to reach your daily goal`}</p>
                  ) : (
                    <p>Congratulations!! You've reached your daily goal!</p>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
};

export default FluidIntakeByDays;
