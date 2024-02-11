import { SetUser } from '../main.d';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
type LogoutProps = {
  setUser: SetUser;
  isLoggedIn: boolean;
};
const Logout = ({ setUser, isLoggedIn }: LogoutProps) => {
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

        // setUser(loginResponse.user);
        setUser(null);
        navigate(`/`);
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
      className="btn btn-xs sm:btn-sm md:btn-md bg-primary-500"
      onClick={handleSubmit}
      // onClick={() => {

      //   // navigate('/');
      //   // setUser(null);
      // }}
    >
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
};

export default Logout;
