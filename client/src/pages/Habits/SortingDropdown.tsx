import {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import DownUpSVG from './DownUpSVG';
import CheckboxSVG from './CheckboxSVG';
import type {
  SetSortingByWithDirection,
  SortBy,
  SortDirection,
  SortingByWithDirection,
} from './sortingByAndDirection';

type SortingOptionButtonProps = {
  onClick: (e: React.MouseEvent, by: SortBy, direction: SortDirection) => void;
  by: SortBy;
  direction: SortDirection;
  activeByAndDirection: SortingByWithDirection;
  children: ReactNode;
};
function SortingOptionButton({
  onClick,
  by,
  direction,
  activeByAndDirection,
  children,
}: SortingOptionButtonProps) {
  const isActive = useMemo(
    () =>
      activeByAndDirection.by === by &&
      activeByAndDirection.direction === direction,
    [activeByAndDirection, by, direction]
  );
  return (
    <button
      onClick={(e) => onClick(e, by, direction)}
      className={`hover:text-accents-100 hover:bg-accents-400 bg-base-100 ${
        isActive ? '' : 'pl-11'
      }`}
    >
      {isActive && <CheckboxSVG />}
      {children}
    </button>
  );
}

const useDropdownCloseOnOutsideClick = (
  dropdownRef: React.RefObject<HTMLDetailsElement>
) => {
  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      'click',
      (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as HTMLElement)
        ) {
          dropdownRef.current!.removeAttribute('open');
        }
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [dropdownRef]);
};

type SortingDropdownProps = {
  sortingByWithDirection: SortingByWithDirection;
  setSortingByWithDirection: SetSortingByWithDirection;
};
export default function SortingDropdown({
  sortingByWithDirection,
  setSortingByWithDirection,
}: SortingDropdownProps) {
  const [animationClass, setAnimationClass] = useState('');
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const handleSummaryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const isOpen = dropdownRef.current!.hasAttribute('open');

    if (isOpen) {
      // Start closing animation (left to right)
      setAnimationClass('sort-fade-out');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        dropdownRef.current!.removeAttribute('open');
        setAnimationClass('');
      }, 300);
    } else {
      dropdownRef.current!.setAttribute('open', '');
      // Opening animation (right to left)
      setAnimationClass('sort-fade-in');
    }
  };

  useDropdownCloseOnOutsideClick(dropdownRef);

  const handleSortOptionClick = useCallback(
    (_: React.MouseEvent, by: SortBy, direction: SortDirection) => {
      dropdownRef.current?.removeAttribute('open');
      setSortingByWithDirection({ by, direction });
    },
    [setSortingByWithDirection]
  );

  return (
    <details
      ref={dropdownRef}
      className="dropdown dropdown-end mx-4 self-end"
      onClick={handleSummaryButtonClick}
    >
      <summary
        className="marker:content-none cursor-pointer"
        aria-label="Sort By"
      >
        <DownUpSVG />
      </summary>
      <ul
        className={`menu dropdown-content bg-slate-200 rounded-box z-[1] w-52 p-2 shadow gap-1 ${animationClass}`}
      >
        <li className="text-primary-600 font-bold">Sort</li>
        <li>
          <SortingOptionButton
            by="HABIT_CREATION"
            direction="ASC"
            activeByAndDirection={sortingByWithDirection}
            onClick={handleSortOptionClick}
          >
            Unsorted
          </SortingOptionButton>
        </li>
        <li>
          <SortingOptionButton
            by="LATEST_ENACTMENT"
            direction="DESC"
            activeByAndDirection={sortingByWithDirection}
            onClick={handleSortOptionClick}
          >
            By Newest Enact
          </SortingOptionButton>
        </li>
        <li>
          <SortingOptionButton
            by="LATEST_ENACTMENT"
            direction="ASC"
            activeByAndDirection={sortingByWithDirection}
            onClick={handleSortOptionClick}
          >
            By Oldest Enact
          </SortingOptionButton>
        </li>
      </ul>
    </details>
  );
}
