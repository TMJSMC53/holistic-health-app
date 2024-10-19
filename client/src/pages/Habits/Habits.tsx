import { useState, useRef, useEffect } from 'react';
import HabitItem from './HabitItem';

export interface Habits {
  _id: string;
  title: string;
  enactments: string[];
}

const Habits = () => {
  const [habits, setHabits] = useState<Habits[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHabits();
  }, []);

  const getHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const fetchedHabits: Habits[] = await response.json();
        setHabits(fetchedHabits);
      } else {
        console.error('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

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

  const handleHabitClick = async (habit: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: habit }),
      });

      if (response.ok) {
        const newHabit: Habits = await response.json();
        setHabits((prevHabits) => [...prevHabits, newHabit]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Error occurred', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="text-primary-600 font-poppins">
      <div className="dropdown" ref={dropdownRef}>
        <button
          className="text-primary-600 btn bg-transparent hover:bg-transparent border-2 hover:border-primary-700 border-primary-600 m-1"
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : '+ Add Habit'}
        </button>
        {isOpen && (
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
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
          </ul>
        )}
      </div>
      <div className="habits-list">
        {habits.map((habit) => (
          <HabitItem key={habit._id} habit={habit} />
        ))}
      </div>
    </div>
  );
};

export default Habits;
