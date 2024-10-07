import React, { useEffect, useState } from 'react';
import { Fluid } from '../Fluids/FluidIntakeLog';
import { WaterGoal } from '../Fluids/CustomizableWaterIntakeGoalForm';
import Confetti from 'react-confetti';

type GroupSum = {
  date: string;
  totalAmount: number;
  waterGoalAmountDate: number;
  group: Fluid[];
};

const FluidIntakeByDays: React.FC = () => {
  const [fluidList, setFluidList] = useState<Fluid[]>([]);
  const [waterGoalAmount, setWaterGoalAmount] = useState<number>(4000);
  const [historicalWaterGoals, setHistoricalWaterGoalAmount] = useState<
    WaterGoal[]
  >([]);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch('/api/fluidIntakes', {
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
        const goalAmount = data[0]?.amount || 4000;
        setHistoricalWaterGoalAmount(data.reverse());
        setWaterGoalAmount(goalAmount.toString());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getList();
  }, []);

  const waterList = fluidList.filter((item) => item.fluidType === 'Water');

  const acc: Record<string, { totalAmount: number; group: Fluid[] }> = {};

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

  const groupedAndSummed: Array<GroupSum> = [];

  for (const date in acc) {
    const { totalAmount, group } = acc[date];

    let waterGoalAmountDate = 4000;

    for (let historicalWaterGoal of historicalWaterGoals) {
      if (
        new Date(historicalWaterGoal.date).toISOString().split('T')[0] <=
        new Date(date).toISOString().split('T')[0]
      ) {
        waterGoalAmountDate = historicalWaterGoal.amount;
      }
    }
    console.log(waterGoalAmountDate);
    groupedAndSummed.push({
      date,
      totalAmount,
      group,
      waterGoalAmountDate,
    });
  }

  useEffect(() => {
    const dateToday = new Date().toLocaleDateString();
    const waterIntakeToday = acc[dateToday] ? acc[dateToday].totalAmount : 0;
    const goalReached = waterIntakeToday >= waterGoalAmount;
    let confettiShownDates = [];

    try {
      const localStorageConfetti = localStorage.getItem('confetti');
      if (localStorageConfetti) {
        confettiShownDates = JSON.parse(localStorageConfetti);
      }
    } catch (e) {
      localStorage.removeItem('confetti');
    }

    const confettiShown = confettiShownDates.includes(dateToday);

    if (goalReached && !confettiShown) {
      setShowConfetti(true);
      confettiShownDates.push(dateToday);
      localStorage.setItem('confetti', JSON.stringify(confettiShownDates));

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [waterGoalAmount, acc]);

  return (
    <>
      {groupedAndSummed
        .slice(0, 2)
        .map(({ date, totalAmount, group, waterGoalAmountDate }, index) => (
          <div
            className="flex flex-col  my-4 mx-6 md:my-8 md:mx-16 lg:mx-36 border border-accents-300 rounded-t-12"
            key={index}
          >
            <h2 className="text-14 md:text-20 lg:text-28 my-6 mx-auto  text-primary-700 font-poppins font-medium">
              Date: {date}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <table className="table table-zebra font-poppins">
                <thead>
                  <tr className="text-14 md:text-18 lg:text-24 text-primary-600 bg-accents-300 uppercase font-playfair">
                    <th>Fluid Type</th>
                    <th>ML</th>
                  </tr>
                </thead>
                <tbody className="text-12 md:text-16 lg:text-20">
                  {group.map((item) => (
                    <tr key={item._id}>
                      <td>{item.fluidType}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={6}
                      className="row-span-full col-span-full bg-primary-600 text-accents-300"
                    >
                      Total:
                      {totalAmount < waterGoalAmountDate ? (
                        <>
                          {` Drink ${Math.abs(
                            totalAmount - Number(waterGoalAmountDate)
                          )} ml more water`}
                        </>
                      ) : totalAmount > waterGoalAmountDate ? (
                        <>
                          {` You've drunk ${
                            totalAmount - Number(waterGoalAmountDate)
                          }ml over your water goal`}
                        </>
                      ) : (
                        <>
                          {` Congratulations!! You've reached your daily goal of ${Number(
                            waterGoalAmountDate
                          )}ml!!`}
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      {showConfetti && (
        <div className="fixed top-0 left-0 inset-0 z-10">
          <Confetti />
        </div>
      )}
    </>
  );
};

export default FluidIntakeByDays;
