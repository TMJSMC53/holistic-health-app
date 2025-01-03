import { useParams } from 'react-router-dom';
import { UserState } from '../../main.d';
import { FormEvent, useState, useEffect } from 'react';
import { formatDistance, startOfDay } from 'date-fns';
import { HabitData } from '../../habits';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
import HabitDeleteForm from './HabitDeleteForm';
import HabitUpdateForm from './HabitUpdateForm';
import BackButton from '../../components/BackButton';
export type HabitProps = {
  habits: HabitData[];
  user: UserState;
};

function calculateMaxStreak(dates: string[]): number {
  if (!dates || !dates.length) return 0;

  const uniqueDates = [
    ...new Set(dates.map((date) => startOfDay(new Date(date)).toISOString())),
  ]
    .sort()
    .reverse();

  if (uniqueDates.length === 1) {
    const date = startOfDay(new Date(uniqueDates[0]));
    const today = startOfDay(new Date());
    const yesterday = startOfDay(new Date(today));
    yesterday.setDate(yesterday.getDate() - 1);

    return date.getTime() === today.getTime() ||
      date.getTime() === yesterday.getTime()
      ? 1
      : 0;
  }

  let streak = 1;
  let maxStreak = 1;

  // Use unique dates for streak calculation
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);

    const diffDays =
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }

  return maxStreak;
}

function calculateCurrentStreak(dates: string[]): number {
  if (!dates || !dates.length) return 0;

  const uniqueDates = [
    ...new Set(dates.map((date) => startOfDay(new Date(date)).toISOString())),
  ]
    .sort()
    .reverse();

  if (uniqueDates.length === 1) {
    const date = startOfDay(new Date(uniqueDates[0]));
    const today = startOfDay(new Date());
    const yesterday = startOfDay(new Date(today));
    yesterday.setDate(yesterday.getDate() - 1);

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

const Habit = ({ habits, user }: HabitProps) => {
  sendAuthenticatedUserToLoginPage(user);

  const { habitTitle } = useParams();
  const [habit, setHabit] = useState<HabitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxStreak, setMaxStreak] = useState(() =>
    calculateMaxStreak(habit?.enactments || [])
  );
  const [currentStreak, setCurrentStreak] = useState(() =>
    calculateMaxStreak(habit?.enactments || [])
  );
  // const [habitData, setHabitData] = useState<HabitData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(1);
  const [showPlusOne, setShowPlusOne] = useState(false);

  useEffect(() => {
    // Recalculate maxStreak when `habit.enactments` changes
    setMaxStreak(calculateMaxStreak(habit?.enactments || []));
    setCurrentStreak(calculateCurrentStreak(habit?.enactments || []));
  }, [habit?.enactments]);

  // Find the matching habit when habits or habitTitle changes
  useEffect(() => {
    if (habits.length > 0 && habitTitle) {
      const foundHabit = habits.find((h) => h.title === habitTitle);

      if (foundHabit) {
        setHabit(foundHabit);
        setCurrentStreak(calculateMaxStreak(foundHabit.enactments));
        setMaxStreak(calculateMaxStreak(foundHabit.enactments));
        setLoading(false);
        setError(null);
      } else {
        setError('Habit not found');
        setLoading(false);
      }
    } else if (!habits.length) {
      setLoading(true);
    }
  }, [habitTitle, habits]);

  useEffect(() => {
    if (habit) {
      const hasEnactmentToday = habit.enactments.some((enactment) => {
        const enactmentDate = startOfDay(new Date(enactment));
        const today = startOfDay(new Date());
        return enactmentDate.getTime() === today.getTime();
      });

      setShowPlusOne(hasEnactmentToday);

      const plusOneEnactment = habit.enactments.filter((enactment) => {
        const enactmentDate = startOfDay(new Date(enactment));
        const today = startOfDay(new Date());
        return enactmentDate.getTime() === today.getTime();
      });
      setCounter(plusOneEnactment.length);
    }
  }, [habit]);

  // Get the latest enactment timestamp
  const getLatestEnactment = () => {
    if (!habit?.enactments?.length) return new Date();
    return new Date(
      [...habit.enactments].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
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
      const response = await fetch(`/api/habits/${habit?._id}/enactments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        // Set error message from backend but keep card visible by avoiding state reset
        setError(data.message || 'Failed to record habit');
        return; // Exit to avoid setting other states
      }

      // Update with the complete habit data from the response
      setHabit(data);
      setCurrentStreak(calculateCurrentStreak(data.enactments));
      setMaxStreak(calculateMaxStreak(data.enactments));
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
        `/api/habits/${habit?._id}/enactments/plusOne`,
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="ml-4">
        <BackButton />
      </div>
      <div className="min-h-full text-14 text-primary-600 font-poppins flex flex-col items-center justify-center overflow-x-hidden m-4">
        <div className="w-full md:max-w-md flex flex-col justify-center border-2 border-primary-700 habits-list p-4">
          <div className="flex justify-between item-center font-poppins">
            <div className="text-16 flex items-center">
              {habit?.title} habit
            </div>
            <div className="flex items-center gap-2">
              {habit && <HabitUpdateForm habit={habit} isOnHabitPage={true} />}
              {habit && <HabitDeleteForm habit={habit} />}
            </div>

            {/* <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="text-primary-600 btn bg-accents-100 hover:bg-accents-300 transition-all duration-300 ml-4"
            >
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
          </div> */}
          </div>
          <div>
            <div className="w-48 border-2 border-primary-700 habits-list my-4 p-4">
              <p>Current streak: {currentStreak}</p>
              <p>Max Streak: {maxStreak}</p>
            </div>
            <p className="text-12 text-primary-400 italic mt-2">
              Last recorded: {lastSeen}
            </p>
            <div className="flex items-center justify-between">
              <button
                className="text-primary-600 btn bg-transparent hover:bg-primary-700 hover:text-accents-100 border-2 border-primary-600 hover:border-primary-700 relative before:absolute before:border-transparent transition-all duration-300 my-4"
                onClick={handleEnactmentsCreation}
                disabled={isRecording}
              >
                {isRecording ? 'Recording...' : `Record ${habit?.title}`}
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
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Habit;
