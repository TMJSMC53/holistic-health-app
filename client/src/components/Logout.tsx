import { SetUser } from '../main.d';
import { useNavigate } from 'react-router-dom';
type LogoutProps = {
  setUser: SetUser;
};
const Logout = ({ setUser }: LogoutProps) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-outline btn-secondary"
      onClick={() => {
        navigate('/');
        setUser(null);
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
