import { Link } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { formatDistance, startOfDay } from 'date-fns';
import HabitUpdateForm from '../Habit/HabitUpdateForm';
import HabitDeleteForm from '../Habit/HabitDeleteForm';
import ClapAnimation from '../../components/ClapAnimation';
export interface Habits {
  _id: string;
  title: string;
  enactments: string[];
}
function countCurrentStreak(dates: string[]): number {
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

const HabitItem = ({
  habit,
  setHabit,
  updateHabitTitle,
}: {
  habit: Habits;
  setHabit: (habit: Habits) => void;
  updateHabitTitle: (id: string, title: string) => void;
}) => {
  const [currentStreak, setCurrentStreak] = useState(() =>
    countCurrentStreak(habit.enactments || [])
  );
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(1);
  const [showPlusOne, setShowPlusOne] = useState(false);

  const [clapVisible, setClapVisible] = useState(false);

  useEffect(() => {
    const hasEnactmentToday = habit.enactments?.some((enactment) => {
      const enactmentDate = startOfDay(new Date(enactment));
      const today = startOfDay(new Date());
      return enactmentDate.getTime() === today.getTime();
    });
    setShowPlusOne(hasEnactmentToday);
  }, [habit.enactments]);

  useEffect(() => {
    const plusOneEnactment = habit.enactments?.filter((enactment) => {
      const enactmentDate = startOfDay(new Date(enactment));
      const today = startOfDay(new Date());
      return enactmentDate.getTime() === today.getTime();
    });
    setCounter(plusOneEnactment?.length || 0);
  }, [habit.enactments]);

  // Get the latest enactment timestamp
  const getLatestEnactment = () => {
    if (!habit.enactments?.length) return new Date();
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
      // Get current timestamp in user's local timezone
      const localDate = new Date();
      const timeZoneOffset = localDate.getTimezoneOffset();
      const userTimestamp = localDate.toISOString();

      const response = await fetch(`/api/habits/${habit._id}/enactments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeZoneOffset: timeZoneOffset,
          timestamp: userTimestamp,
        }),
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
      setClapVisible(true);
      setTimeout(() => setClapVisible(false), 1000);
    } catch (error) {
      setError('Failed to record additional habit');
      console.error('Error:', error);
    } finally {
      setIsRecording(false);
    }
  }

  // Helper Function to Remove Emoji from Record Button
  const removeEmojiFromRecordBtn = (str: string) => {
    return str
      .replace(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
        ''
      )
      .trim();
  };

  return (
    <div className="border-2 border-primary-700 habits-list m-4 pb-4 px-4">
      <div>
        <div className="flex justify-between items-center">
          {/* add the icon */}
          <span className="text-16">{habit.title}</span>
          <div className="flex items-center gap-2">
            <HabitUpdateForm
              habit={habit}
              isOnHabitPage={false}
              updateHabitTitle={updateHabitTitle}
            />
            <HabitDeleteForm habit={habit} />
          </div>
          {/* <div className="dropdown">
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
          </div> */}
        </div>
        <div>
          <p>Current streak: {currentStreak}</p>
          <p className="text-12 text-primary-400 italic mt-2">
            Last recorded: {lastSeen}
          </p>
          <div className="flex items-center justify-between relative">
            <button
              className="text-primary-600 btn bg-transparent hover:bg-primary-700 hover:text-accents-100 border-2 border-primary-600 hover:border-primary-700 relative before:absolute before:border-transparent transition-all duration-300 my-4"
              onClick={handleEnactmentsCreation}
              disabled={isRecording}
            >
              {isRecording
                ? 'Recording...'
                : `Record ${removeEmojiFromRecordBtn(habit.title)}`}
            </button>
            {showPlusOne && (
              <>
                <button
                  className="text-primary-600 btn bg-transparent hover:bg-primary-400 hover:text-accents-100 border-2 border-accents-400 hover:border-primary-400 relative before:absolute before:border-transparent transition-all duration-300 my-4"
                  onClick={handlePlusOneCreation}
                >
                  + {counter}
                </button>
              </>
            )}
            <ClapAnimation show={clapVisible} />
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
