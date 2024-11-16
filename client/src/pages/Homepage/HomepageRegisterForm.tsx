import { FormEvent, ChangeEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SetUser } from '../../main.d';

type HomepageRegisterFormProps = {
  setUser: SetUser;
  switchForm: () => void;
};
const HomepageRegisterForm = ({
  setUser,
  switchForm,
}: HomepageRegisterFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerError, setRegisterError] = useState<string>('');

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
          }),
        });
        if (response.ok) {
          // Registration successful
          const registerResponse = await response.json();

          setUser(registerResponse.user);

          navigate(`/dashboard`);
        } else {
          // Registration failed
          const errorResponse = await response.json();

          setRegisterError(errorResponse.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  function handleFirstName(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
    if (errors.firstName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: '',
      }));
    }
  }
  function handleLastName(event: ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
    if (errors.lastName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: '',
      }));
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

    if (registerError) {
      setRegisterError('');
    }
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    if (errors.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: '',
      }));
    }
  }

  return (
    <>
      <div>
        {registerError && (
          <div className="bg-primary-700 text-red-100 p-4 mb-4">
            {registerError}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="card-body font-poppins ">
        <div className="form-control ">
          <h2 className="text-accents-200 text-20 font-extrabold mb-6">
            Register to create an account
          </h2>
          <label className="label">
            <span className="label-text text-primary-600">First Name</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            className={`input input-bordered ${
              errors.firstName ? 'border-primary-700' : ''
            }`}
            value={firstName}
            onChange={handleFirstName}
            required
            onInvalid={(e) => {
              e.preventDefault();
              setErrors((prevErrors) => ({
                ...prevErrors,
                firstName: 'First Name is required',
              }));
            }}
          />
          {errors.firstName && (
            <span className="text-12 mt-1 text-primary-700">
              {errors.firstName}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary-600">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className={`input input-bordered ${
              errors.lastName ? 'border-primary-700' : ''
            }`}
            value={lastName}
            onChange={handleLastName}
            required
            onInvalid={(e) => {
              e.preventDefault();
              setErrors((prevErrors) => ({
                ...prevErrors,
                lastName: 'Last Name is required',
              }));
            }}
          />
          {errors.lastName && (
            <span className="text-12 mt-1 text-primary-700">
              {errors.lastName}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary-600">Username</span>
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
                username: 'Username is required',
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
            <span className="label-text text-primary-600">Password</span>
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
                password: 'Password must be at least 6 characters long',
              }));
            }}
          />
          {errors.password && (
            <span className="text-12 mt-1 text-primary-700">
              {errors.password}
            </span>
          )}
          <label className="flex mt-2">
            <span className="text-12 text-primary-600">
              Already have an account?
            </span>
            <Link
              to="#"
              className=" link link-hover hover:underline text-12 text-accents-200 font-extrabold pl-1"
              onClick={switchForm}
            >
              Login
            </Link>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-primary-600 hover:bg-primary-700 text-accents-100">
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default HomepageRegisterForm;
