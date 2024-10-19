import { Habits } from './Habits';
import { FormEvent, useState } from 'react';

function countCurrentStreak(dates: string[]): number {
  if (!dates || !dates.length) return 0;

  if (dates.length === 1) {
    const date = new Date(dates[0]);
    const today = new Date();
    const yesterday = new Date(today);

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (
      date.getTime() === today.getTime() ||
      date.getTime() === yesterday.getTime()
    ) {
      return 1;
    }
  }

  // Sort dates in descending order and format to YYYY-MM-DD
  const formattedDates = dates
    .map((date) => new Date(date).toISOString().split('T')[0])
    .sort()
    .reverse();

  let streak = 1;
  console.log(formattedDates);
  // Compare each date with the next one
  for (let i = 0; i < formattedDates.length - 1; i++) {
    const currentDate = new Date(formattedDates[i]);
    const nextDate = new Date(formattedDates[i + 1]);

    // Set time to midnight for clean comparison so that only the date is compared
    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

    // Get difference in days
    const diffTime = currentDate.getTime() - nextDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
const HabitItem = ({ habit }: { habit: Habits }) => {
  const [currentStreak, setCurrentStreak] = useState(() =>
    countCurrentStreak(habit.enactments || [])
  );
  // const streak = countCurrentStreak(habit.enactments);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/habits/${habit._id}/enactments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString(), // Make sure to send the date in ISO format
        }),
      });
      const updatedHabit = await response.json();
      setCurrentStreak(countCurrentStreak(updatedHabit.enactments));
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <div className="grid border-2 border-primary-700 habits-list m-4 p-4">
      <div>
        <div className="flex justify-between">
          {habit.title}

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              + Add QuickLink
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        <p>Current streak: {currentStreak}</p>
        <button className="border-2 border-primary-400">
          Record {habit.title}
        </button>
        <div className="flex justify-end">
          <a className="underline" href="">
            View History
          </a>
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
