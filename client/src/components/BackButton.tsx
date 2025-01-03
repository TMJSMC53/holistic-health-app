import { useNavigate } from 'react-router-dom';
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="backButtonToggle btn btn-xs sm:btn-sm md:btn-md mb-4 bg-primary-600 hover:bg-primary-700 text-accents-100 font-poppins"
      onClick={() => navigate(-1)}
    >
      Back
    </button>
  );
};

export default BackButton;
