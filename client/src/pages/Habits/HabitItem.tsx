import { Habits } from './Habits';
import { Link } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { formatDistance, parseISO } from 'date-fns';

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

    [date, today, yesterday].forEach((d) => d.setHours(0, 0, 0, 0));

    return date.getTime() === today.getTime() ||
      date.getTime() === yesterday.getTime()
      ? 1
      : 0;
  }

  let streak = 1;

  // Use unique dates for streak calculation
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);

    const diffDays =
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) streak++;
    else break;
  }

  return streak;
}

const HabitItem = ({
  habit,
  setHabit,
}: {
  habit: Habits;
  setHabit: (habit: Habits) => void;
}) => {
  const [currentStreak, setCurrentStreak] = useState(() =>
    countCurrentStreak(habit.enactments || [])
  );
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(1);
  const [showPlusOne, setShowPlusOne] = useState(false);

  useEffect(() => {
    const hasEnactmentToday = habit.enactments?.some((enactment) => {
      const enactmentDate = new Date(enactment);
      return enactmentDate.toDateString() === new Date().toDateString();
    });
    setShowPlusOne(hasEnactmentToday);
  }, [habit.enactments]);

  useEffect(() => {
    const plusOneEnactment = habit.enactments?.filter((enactment) => {
      const enactmentDate = new Date(enactment);
      return enactmentDate.toDateString() === new Date().toDateString();
    });
    setCounter(plusOneEnactment.length);
  }, []);

  // Get the latest enactment timestamp
  const getLatestEnactment = () => {
    if (!habit.enactments?.length) return new Date();
    return parseISO(
      [...habit.enactments].sort(
        (a, b) => parseISO(b).getTime() - parseISO(a).getTime()
      )[0]
    );
  };

  const lastSeen = formatDistance(getLatestEnactment(), new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });

  async function handleEnactmentsCreation(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);
    setIsRecording(true);

    try {
      const response = await fetch(`/api/habits/${habit._id}/enactments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        if (data.habit) {
          setHabit(data.habit);
        }
        return;
      }

      // Update with the complete habit data from the response
      setHabit(data);
      setCurrentStreak(countCurrentStreak(data.enactments));
      setCounter(counter + 1);
      setShowPlusOne(true);
    } catch (error) {
      setError('Failed to record habit');
      console.error('Error:', error);
    } finally {
      setIsRecording(false);
    }
  }

  async function handlePlusOneCreation(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);
    setIsRecording(true);

    try {
      const response = await fetch(
        `/api/habits/${habit._id}/enactments/plusOne`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      setHabit(data);
      setCounter(counter + 1);
    } catch (error) {
      setError('Failed to record additional habit');
      console.error('Error:', error);
    } finally {
      setIsRecording(false);
    }
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
          <p className="text-12 text-primary-400 italic mt-2">
            Last recorded: {lastSeen}
          </p>
          <div className="flex items-center justify-between">
            <button
              className="text-primary-600 btn bg-transparent hover:bg-primary-700 hover:text-accents-100 border-2 border-primary-600 hover:border-primary-700 relative before:absolute before:border-transparent transition-all duration-300 my-4"
              onClick={handleEnactmentsCreation}
              disabled={isRecording}
            >
              {isRecording ? 'Recording...' : `Record ${habit.title}`}
            </button>
            {showPlusOne && (
              <button
                className="text-primary-600 btn bg-transparent hover:bg-primary-400 hover:text-accents-100 border-2 border-accents-400 hover:border-primary-400 relative before:absolute before:border-transparent transition-all duration-300 my-4"
                onClick={handlePlusOneCreation}
              >
                + {counter}
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end">
          <Link
            to={`/habit/${habit?.title}`}
            className="underline hover:underline-offset-4 hover:border-primary-600 hover:text-primary-700 hover:font-bold transition duration-300"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
