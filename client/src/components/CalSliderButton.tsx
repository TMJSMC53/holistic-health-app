import { useState, useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import HabitsCalendar from './HabitsCalendar';

const CalSliderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOpen) {
      // Start closing animation (left to right)
      setAnimationClass('menu-slide-out');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsOpen(false);
        setAnimationClass('');
      }, 300);
    } else {
      setIsOpen(true);
      // Opening animation (right to left)
      setAnimationClass('menu-slide-in');
    }
  };

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setAnimationClass('menu-slide-out');
      setTimeout(() => {
        setIsOpen(false);
        setAnimationClass('');
      }, 300);
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
          className={`fixed w-68 right-4 mt-6 ml-4 md:absolute md:right-16 md:mt-2 md:w-68 bg-base-100 rounded-lg z-[1] shadow ${animationClass}`}
        >
          <HabitsCalendar />
        </div>
      )}
    </div>
  );
};

export default CalSliderButton;
