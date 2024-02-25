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
      const response = await fetch(`/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log({ response });
      if (response.ok) {
        // Registration successful
        const logoutResponse = await response.json();
        alert(logoutResponse.message);

        setUser(null);
        navigate('/');
      } else {
        // Registration failed
        const errorMessage = await response.text();
        alert(`Logout failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <button
      className="flex items-center justify-center btn btn-md text-center sm:btn-sm md:btn-md bg-primary-500 text-accents-100 hover:bg-primary-700"
      onClick={handleSubmit}
    >
      Logout
    </button>
  );
};

export default Logout;
