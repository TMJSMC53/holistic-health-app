import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react';
import HabitItem from './HabitItem';
import BackButton from '../../components/BackButton';
import { HabitData } from '../../habits';
import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';

type HabitsProps = {
  habits: HabitData[];
  setHabits: React.Dispatch<React.SetStateAction<HabitData[]>>;
  user: UserState;
};
const Habits = ({ habits, setHabits, user }: HabitsProps) => {
  sendAuthenticatedUserToLoginPage(user);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const fetchedHabits: HabitData[] = await response.json();
        setHabits(fetchedHabits);
      } else {
        console.error('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [setHabits, setIsInitialLoading]);

  useEffect(() => {
    getHabits();
  }, [getHabits]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateHabitTitle = (id: string, title: string) => {
    // GIVEN an id of a habit that exists in the habits array
    const foundHabitToUpdate = {
      // create a copy of the habits array
      ...habits.filter((habit) => {
        if (habit._id === id) {
          return true;
        }
      })[0],
    };
    // GIVEN the new title you want to update add it to setHabits
    foundHabitToUpdate.title = title;
    setHabit(foundHabitToUpdate);
  };

  const handleHabitClick = async (habit: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: habit }),
      });
      const newHabitData = await response.json();
      if (!response.ok) {
        setError(newHabitData.message);
        return;
      }
      setHabits((prevHabits) => [...prevHabits, newHabitData]);
      setIsOpen(false);
    } catch (err) {
      console.error('Error occurred', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Habit Creation
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleHabitClick(title);
    setIsModalOpen(false);
  }
  // Custom Habit Title
  function handleTitle(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function setHabit(latestHabit: HabitData) {
    setHabits(
      habits.map((habit) => {
        if (habit._id === latestHabit._id) {
          return latestHabit;
        } else {
          return habit;
        }
      })
    );
  }

  if (isInitialLoading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="text-primary-600 font-poppins">
      <div className="ml-4">
        <BackButton />
      </div>
      <div className={`modal ${isModalOpen && 'modal-open'}`} role="dialog">
        <div className="modal-box h-90 md:w-96 overflow-y-hidden px-4 bg-accents-500">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mt-4">
              <p className="text-12 md:text-14 text-primary-600 font-poppins font-bold">
                Title:
              </p>
              <input
                value={title}
                onChange={handleTitle}
                className="text-12 md:text-16 text-primary-600 font-poppins border w-full"
                type="string"
              />
            </div>
          </form>
        </div>
        <div className="modal-backdrop">
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
      <div className="dropdown" ref={dropdownRef}>
        <button
          className="text-primary-600 btn bg-transparent hover:bg-transparent border-2 hover:border-primary-700 border-primary-600 m-4"
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : '+ Add Habit'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {isOpen && (
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow !visible !opacity-100"
          >
            <li>
              <button
                onClick={() => handleHabitClick('Exercise')}
                disabled={isLoading}
              >
                Exercise
              </button>
            </li>
            <li>
              <button onClick={() => handleHabitClick('Meditation')}>
                Meditation
              </button>
            </li>
            <li>
              <button onClick={() => handleHabitClick('Sleep')}>Sleep</button>
            </li>
            <li>
              <button onClick={() => setIsModalOpen(true)}>Custom</button>
            </li>
          </ul>
        )}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 habits-list">
        {habits.map((habit) => (
          <HabitItem
            key={habit._id}
            habit={habit}
            setHabit={setHabit}
            updateHabitTitle={updateHabitTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default Habits;
