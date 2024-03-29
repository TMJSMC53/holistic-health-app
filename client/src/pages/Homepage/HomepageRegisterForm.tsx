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

  const navigate = useNavigate();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      console.log(response);
      if (response.ok) {
        // Registration successful
        const registerResponse = await response.json();

        setUser(registerResponse.user);

        navigate(`/dashboard`);
      } else {
        // Registration failed
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleFirstName(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }
  function handleLastName(event: ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }
  function handleUsername(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }
  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <>
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
            className="input input-bordered"
            value={firstName}
            onChange={handleFirstName}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary-600">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered"
            value={lastName}
            onChange={handleLastName}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-primary-600">Username</span>
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
            <span className="label-text text-primary-600">Password</span>
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
