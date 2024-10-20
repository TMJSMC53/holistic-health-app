import { Habits } from './Habits';
import { FormEvent, useState } from 'react';

function countCurrentStreak(dates: string[]): number {
  if (!dates || !dates.length) return 0;

  const uniqueDates = [
    ...new Set(dates.map((date) => new Date(date).toISOString().split('T')[0])),
  ]
    .sort()
    .reverse();

  if (uniqueDates.length === 1) {
    const date = new Date(uniqueDates[0]);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

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

  let streak = 1;

  // Use unique dates for streak calculation
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);

    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

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
  // const setLastSeen = formatDistance(
  //   new Date(habit.enactments[0]),
  //   new Date(),
  //   {
  //     includeSeconds: true,
  //     addSuffix: true,
  //   }
  // );

  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [counter, setCounter] = useState(1);

  async function handleEnactmentsCreation(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);
    setIsRecording(true);
    try {
      const response = await fetch(`/api/habits/${habit._id}/enactments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setIsRecording(false);
      if (!response.ok) {
        setError(data.message);

        if (data.habit) {
          setCurrentStreak(countCurrentStreak(data.habit.enactments));
        }
        return;
      }
      setCurrentStreak(countCurrentStreak(data.enactment));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handlePlusOneCreation(e: FormEvent<HTMLButtonElement>) {
    await fetch(`/api/habits/${habit._id}/enactments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // setCounter(counter + 1)
  }

  return (
    <div className="border-2 border-primary-700 habits-list m-4 p-4">
      <div>
        <div className="flex justify-between">
          {habit.title}

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn ml-4">
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
        <div>
          <p>Current streak: {currentStreak}</p>
          {/* <p>Last seen: {setLastSeen}</p> */}

          <button
            className="text-primary-600 btn bg-transparent hover:bg-primary-700 hover:text-accents-100 border-2 border-primary-600 hover:border-primary-700 relative before:absolute before:border-transparent transition-all duration-300 my-4"
            onClick={handleEnactmentsCreation}
            disabled={isRecording}
          >
            {isRecording ? 'Recording...' : `Record ${habit.title}`}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
