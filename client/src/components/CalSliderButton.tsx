import { useState, useRef, useCallback } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import HabitsCalendar from './HabitsCalendar';
import { HabitData } from '../habits';

type CalSliderButtonProps = { habits: HabitData[] };

const CalSliderButton = ({ habits }: CalSliderButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeWithAnimation = useCallback(() => {
    // Start closing animation (left to right)
    setAnimationClass('menu-slide-out');
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsOpen(false);
      setAnimationClass('');
    }, 300);
  }, [setAnimationClass, setIsOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOpen) {
      closeWithAnimation();
    } else {
      setIsOpen(true);
      // Opening animation (right to left)
      setAnimationClass('menu-slide-in');
    }
  };

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      closeWithAnimation();
    }
  });

  return (
    <div ref={dropdownRef} className="relative">
      <button
        data-testid="button-id"
        type="button"
        onClick={toggleDropdown}
        className="mx-4"
      >
        📅 Cal
      </button>

      {isOpen && (
        <div
          className={`fixed w-68 right-4 mt-6 ml-4 md:absolute md:right-16 md:mt-2 md:w-68 bg-base-100 rounded-full z-[1] shadow ${animationClass}`}
        >
          <HabitsCalendar habits={habits} />
        </div>
      )}
    </div>
  );
};

export default CalSliderButton;
