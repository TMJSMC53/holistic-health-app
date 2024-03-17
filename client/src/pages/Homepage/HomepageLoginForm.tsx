import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SetUser } from '../../main.d';

type HomepageLoginFormProps = {
  setUser: SetUser;
  switchForm: () => void;
};

const HomepageLoginForm = ({ setUser, switchForm }: HomepageLoginFormProps) => {
  console.log('All Props:', setUser, switchForm);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log('Submitting form with username', username);
      console.log('Submitting form with password', password);
      const response = await fetch(`/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      console.log(response);
      if (response.ok) {
        // Registration successful

        const loginResponse = await response.json();

        setUser(loginResponse.user);

        navigate(`/dashboard`);
      } else {
        // Registration failed
        const errorMessage = await response.text();
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleUsername(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="card-body font-poppins">
        <div className="form-control">
          <h2 className="text-accents-200 text-24 font-extrabold mb-6">
            Log In
          </h2>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered"
            value={username}
            onChange={handleUsername}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
            value={password}
            onChange={handlePassword}
            required
          />
          <label className="flex mt-2">
            <span className="text-12">Don't have an account?</span>
            <Link
              to="#"
              className="link link-hover hover:underline text-12 text-accents-200 font-extrabold pl-1"
              onClick={switchForm}
            >
              Register
            </Link>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-primary-600 hover:bg-primary-700 hover:text-accents-100 text-accents-100">
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default HomepageLoginForm;
