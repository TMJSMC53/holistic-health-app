import React, { useEffect, useState } from 'react';

type LIList = {
  _id: string;
  fluidType: string;
  amount: number;
  date: string;
};

type GroupSum = {
  date: string;
  totalAmount: number;
  group: LIList[];
};

const FluidIntakeByDays: React.FC = () => {
  const [fluidList, setFluidList] = useState<LIList[]>([]);
  const [waterGoalAmount, setWaterGoalAmount] = useState<number>(4000);

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

  const waterList = fluidList.filter((item) => item.fluidType === 'Water');

  const acc: Record<string, { totalAmount: number; group: LIList[] }> = {};

  for (let i = 0; i < waterList.length; i++) {
    const item = waterList[i];

    const days = new Date(item.date);
    const formattedDate = days.toLocaleDateString();

    if (!acc[formattedDate]) {
      acc[formattedDate] = { totalAmount: 0, group: [] };
    }

    acc[formattedDate].totalAmount += item.amount;
    acc[formattedDate].group.push(item);
  }
  console.log(acc);

  const groupedAndSummed: Array<GroupSum> = [];

  for (const date in acc) {
    const { totalAmount, group } = acc[date];
    groupedAndSummed.push({ date, totalAmount, group });
  }

  // const groupedAndSummed: Array<GroupSum> = Object.entries(
  //   waterList.reduce((acc, item) => {
  //     const days = new Date(item.date);
  //     const formattedDate = days.toLocaleDateString();

  //     if (!acc[formattedDate]) {
  //       acc[formattedDate] = { totalAmount: 0, group: [] };
  //     }

  //     acc[formattedDate].totalAmount += item.amount;
  //     acc[formattedDate].group.push(item);
  //     return acc;
  //   }, {} as Record<string, { totalAmount: number; group: LIList[] }>)
  // ).map(([date, { totalAmount, group }]) => ({ date, totalAmount, group }));

  return (
    <>
      {groupedAndSummed.map(({ date, totalAmount, group }, index) => (
        <div className="flex flex-col " key={index}>
          <h2 className="mx-auto">Date: {date}</h2>
          <div className="grid grid-cols-2 gap-4">
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
                  </tr>
                ))}
                <tr>
                  <td colSpan={6} className="row-span-full col-span-full">
                    Total:
                    {totalAmount < waterGoalAmount ? (
                      <>
                        {` Drink ${Math.abs(totalAmount - 4000)} ml more water`}
                      </>
                    ) : totalAmount > 4000 ? (
                      <>
                        {`You've drunk ${
                          totalAmount - 4000
                        }ml over your water goal`}
                      </>
                    ) : (
                      <> Congratulations!! You've reached your daily goal!</>
                    )}
                  </td>
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
