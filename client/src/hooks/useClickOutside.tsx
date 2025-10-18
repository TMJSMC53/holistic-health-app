import { useEffect, RefObject } from 'react';

const useClickOutside = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  callback?: () => void
) => {
  useEffect(() => {
    const controller = new AbortController();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        // If callback is provided, call it
        if (callback) {
          callback();
        }
      }
    };

    document.addEventListener('click', handleClickOutside, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [elementRef, callback]);
};

export default useClickOutside;
