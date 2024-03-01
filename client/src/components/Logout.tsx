import { SetUser } from '../main.d';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
type LogoutProps = {
  setUser: SetUser;
};
const Logout = ({ setUser }: LogoutProps) => {
  const navigate = useNavigate();

  async function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      await fetch(`/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(null);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <button
      className="btn btn-md text-center sm:btn-sm md:btn-md bg-primary-500 text-accents-100 hover:bg-primary-700"
      onClick={handleSubmit}
    >
      Logout
    </button>
  );
};

export default Logout;
