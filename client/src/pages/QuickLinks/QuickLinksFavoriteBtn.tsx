import { MouseEvent } from 'react';

const QuickLinksFavoriteBtn = ({
  isFavorite,
  setIsFavorite,
}: {
  isFavorite: boolean;
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsFavorite(!isFavorite);
  };
  return (
    <button onClick={toggleFavorite}>
      {isFavorite ? (
        <svg
          fill="#ff0000"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          stroke="#ff0000"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#ff0000"
            stroke-width="3.072"
          >
            <title>hearts</title>
            <path d="M27.267 11.489c0.21 6.687-10.266 11.384-11.25 15.056-1.075-4.011-11.060-8.078-11.283-15.056-0.214-6.701 8.047-8.155 11.283-2.55 3.316-5.743 11.043-4.039 11.25 2.55z"></path>
          </g>
          <g id="SVGRepo_iconCarrier">
            <title>hearts</title>
            <path d="M27.267 11.489c0.21 6.687-10.266 11.384-11.25 15.056-1.075-4.011-11.060-8.078-11.283-15.056-0.214-6.701 8.047-8.155 11.283-2.55 3.316-5.743 11.043-4.039 11.25 2.55z"></path>
          </g>
        </svg>
      ) : (
        <svg
          fill="#ffffff"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          stroke="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#ff0000"
            stroke-width="3.072"
          >
            <title>hearts</title>
            <path d="M27.267 11.489c0.21 6.687-10.266 11.384-11.25 15.056-1.075-4.011-11.060-8.078-11.283-15.056-0.214-6.701 8.047-8.155 11.283-2.55 3.316-5.743 11.043-4.039 11.25 2.55z"></path>
          </g>
          <g id="SVGRepo_iconCarrier">
            <title>hearts</title>
            <path d="M27.267 11.489c0.21 6.687-10.266 11.384-11.25 15.056-1.075-4.011-11.060-8.078-11.283-15.056-0.214-6.701 8.047-8.155 11.283-2.55 3.316-5.743 11.043-4.039 11.25 2.55z"></path>
          </g>
        </svg>
      )}
    </button>
  );
};

export default QuickLinksFavoriteBtn;
