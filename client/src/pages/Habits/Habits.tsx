import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
  useMemo,
  ReactNode,
} from 'react';
import HabitItem from './HabitItem';
import BackButton from '../../components/BackButton';
import { HabitData } from '../../habits';
import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';

type SortBy = 'HABIT_CREATION' | 'LATEST_ENACTMENT';
type SortDirection = 'ASC' | 'DESC'

const CheckboxSVG = () => <svg role="img" aria-label="Active (checkbox) icon" className='text-accents-200 fill-current' viewBox="0 0 24 24" width="20px" height="20px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 7.34189C18.6095 6.95136 17.9763 6.95136 17.5858 7.34189L10.3407 14.587C9.95016 14.9775 9.31699 14.9775 8.92647 14.587L6.38507 12.0456C5.99454 11.6551 5.36138 11.6551 4.97085 12.0456C4.58033 12.4361 4.58033 13.0693 4.97085 13.4598L7.51774 16C8.68969 17.1689 10.5869 17.1677 11.7574 15.9974L19 8.7561C19.3905 8.36558 19.3905 7.73241 19 7.34189Z" ></path> </g></svg>
const DownUpSVG = () => <svg viewBox="0 0 24 24" width="40px" height="40px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM7.55495 12.7455C7.27632 12.439 6.80199 12.4164 6.49549 12.695C6.189 12.9737 6.16641 13.448 6.44504 13.7545L8.94504 16.5045C9.08719 16.6609 9.28869 16.75 9.5 16.75C9.71131 16.75 9.91281 16.6609 10.055 16.5045L12.555 13.7545C12.8336 13.448 12.811 12.9737 12.5045 12.695C12.198 12.4164 11.7237 12.439 11.445 12.7455L10.25 14.06V8C10.25 7.58579 9.91421 7.25 9.5 7.25C9.08579 7.25 8.75 7.58579 8.75 8V14.06L7.55495 12.7455ZM11.4955 11.305C11.802 11.5836 12.2763 11.561 12.555 11.2545L13.75 9.93995L13.75 16C13.75 16.4142 14.0858 16.75 14.5 16.75C14.9142 16.75 15.25 16.4142 15.25 16L15.25 9.93995L16.445 11.2545C16.7237 11.561 17.198 11.5836 17.5045 11.305C17.811 11.0263 17.8336 10.552 17.555 10.2455L15.055 7.49549C14.9128 7.33914 14.7113 7.25 14.5 7.25C14.2887 7.25 14.0872 7.33914 13.945 7.49549L11.445 10.2455C11.1664 10.552 11.189 11.0263 11.4955 11.305Z" fill="#1C274C"></path> </g></svg>

function SortingOptionButton({ onClick, by, direction, activeByAndDirection, children }: { onClick: (e: React.MouseEvent, by: SortBy, direction: SortDirection) => void, by: SortBy, direction: SortDirection, activeByAndDirection: { by: SortBy, direction: SortDirection }, children: ReactNode }) {
  const isActive = useMemo(() => activeByAndDirection.by === by && activeByAndDirection.direction === direction, [activeByAndDirection, by, direction])
  return (
    <button
      onClick={(e) => onClick(e, by, direction)}
      className={`hover:text-accents-100 hover:bg-accents-400 bg-base-100 ${isActive ? '' : 'pl-11'}`}
    >
      {isActive ? <CheckboxSVG /> : null}
      {children}
    </button>
  )
}

function SortingDropdown({ sortingByWithDirection, setSortingByWithDirection }: { sortingByWithDirection: ReturnType<typeof useSortingByWithDirection>[0], setSortingByWithDirection: ReturnType<typeof useSortingByWithDirection>[1] }) {
  const handleSortOptionClick = useCallback((e: React.MouseEvent, by: SortBy, direction: SortDirection) => {
    e.currentTarget.closest('details')?.removeAttribute('open');
    setSortingByWithDirection({ by, direction })
  }, [setSortingByWithDirection])

  return (
    <details className="dropdown dropdown-end mx-4 self-end">
      <summary className="marker:content-none cursor-pointer" aria-label='Sort By'><DownUpSVG /></summary>
      <ul className="menu dropdown-content bg-slate-50 rounded-box z-[1] w-52 p-2 shadow gap-1">
        <li className='text-gray-500'>
          Sort
        </li>
        <li>
          <SortingOptionButton
            by='HABIT_CREATION' direction="ASC"
            activeByAndDirection={sortingByWithDirection} onClick={handleSortOptionClick}
          >
            Unsorted
          </SortingOptionButton>
        </li>
        <li>
          <SortingOptionButton
            by='LATEST_ENACTMENT' direction="DESC"
            activeByAndDirection={sortingByWithDirection} onClick={handleSortOptionClick}
          >
            By Newest Enact
          </SortingOptionButton>
        </li>
        <li>
          <SortingOptionButton
            by='LATEST_ENACTMENT' direction="ASC"
            activeByAndDirection={sortingByWithDirection} onClick={handleSortOptionClick}
          >
            By Oldest Enact
          </SortingOptionButton>
        </li>
      </ul>
    </details>
  )
}

const useSortingByWithDirection = () => {
  const [sortingByWithDirection, setSortingByWithDirection] = useState<{
    by: SortBy,
    direction: SortDirection
  }>(() => {
    const defaultValue = { by: 'HABIT_CREATION', direction: 'ASC' };
    const rawValue = localStorage.getItem('habits-sorting-by-and-direction')
    if (rawValue === null) return defaultValue
    try {
      return JSON.parse(rawValue)
    } catch (error) {
      console.warn(error)
      return defaultValue
    }
  })

  useEffect(() => {
    localStorage.setItem('habits-sorting-by-and-direction', JSON.stringify(sortingByWithDirection))
  }, [sortingByWithDirection])

  return [sortingByWithDirection, setSortingByWithDirection] as const
}

const getSortedHabits = (habits: HabitData[], by: SortBy, direction: SortDirection) => [...habits].sort((a, b) => {
  const enactmentIndex = by === 'HABIT_CREATION' ? 0 : -1

  const aDate = a.enactments.at(enactmentIndex)!;
  const bDate = b.enactments.at(enactmentIndex)!;

  if (direction === 'ASC') {
    return aDate.localeCompare(bDate)
  } else {
    return bDate.localeCompare(aDate)
  }
})

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
  const [sortingByWithDirection, setSortingByWithDirection] = useSortingByWithDirection();

  const sortedHabits = useMemo(() => getSortedHabits(habits, sortingByWithDirection.by, sortingByWithDirection.direction), [habits, sortingByWithDirection])

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
      <div className='flex'>
        <div className="dropdown flex-1" ref={dropdownRef}>
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
        <SortingDropdown sortingByWithDirection={sortingByWithDirection} setSortingByWithDirection={setSortingByWithDirection} />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 habits-list">
        {sortedHabits.map((habit) => (
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
