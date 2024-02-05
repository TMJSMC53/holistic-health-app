import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        alert(loginResponse.message);

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
      <form onSubmit={handleSubmit} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
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
            placeholder="password"
            className="input input-bordered"
            value={password}
            onChange={handlePassword}
            required
          />
          <label className="label">
            <a href="#" className="label-text-alt" onClick={switchForm}>
              Don't have an account?
              <span className="link link-hover text-indigo-500 font-extrabold pl-1">
                Register
              </span>
            </a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary ">Login</button>
        </div>
      </form>
    </>
  );
};

export default HomepageLoginForm;
