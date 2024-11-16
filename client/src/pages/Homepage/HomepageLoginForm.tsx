import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SetUser } from '../../main.d';

type HomepageLoginFormProps = {
  setUser: SetUser;
  switchForm: () => void;
};

const HomepageLoginForm = ({ setUser, switchForm }: HomepageLoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string>('');

  const validateLoginForm = () => {
    const errors: { [key: string]: string } = {};

    if (!username.trim()) {
      errors.username = 'Username must not be empty';
    }
    if (password.length < 6) {
      errors.password = 'Password must not be empty';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateLoginForm()) {
      try {
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
        if (response.ok) {
          // Login successful

          const loginResponse = await response.json();

          setUser(loginResponse.user);

          navigate(`/dashboard`);
        } else {
          // Login failed
          const errorResponse = await response.json();
          setLoginError(errorResponse.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  function handleUsername(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
    if (errors.username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: '',
      }));
    }
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <>
      {loginError && (
        <div className="bg-primary-700 text-red-100 p-4 mb-4">{loginError}</div>
      )}
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
            className={`input input-bordered ${
              errors.username ? 'border-primary-700' : ''
            }`}
            value={username}
            onChange={handleUsername}
            required
            onInvalid={(e) => {
              e.preventDefault();
              setErrors((prevErrors) => ({
                ...prevErrors,
                username: 'Username must not be empty',
              }));
            }}
          />
          {errors.username && (
            <span className="text-12 mt-1 text-primary-700">
              {errors.username}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className={`input input-bordered ${
              errors.password ? 'border-primary-700' : ''
            }`}
            value={password}
            onChange={handlePassword}
            required
            onInvalid={(e) => {
              e.preventDefault();
              setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password must not be empty',
              }));
            }}
          />
          {errors.password && (
            <span className="text-12 mt-1 text-primary-700">
              {errors.password}
            </span>
          )}

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
