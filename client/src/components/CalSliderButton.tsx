import { useState, useRef } from 'react';
import useClickOutside from '../hooks/useClickOutside';

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
      <button onClick={toggleDropdown} className="mx-4">
        📅 Cal
      </button>

      {isOpen && (
        <div
          className={`fixed w-60 right-24 mt-6 md:absolute md:right-24 md:mt-4 md:w-52 bg-base-100 rounded-box z-[1] p-2 shadow ${animationClass}`}
        >
          <ul>
            <li className="p-2 hover:bg-gray-100 rounded-md">
              <a href="#">Item 1</a>
            </li>
            <li className="p-2 hover:bg-gray-100 rounded-md">
              <a href="#">Item 2</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalSliderButton;
