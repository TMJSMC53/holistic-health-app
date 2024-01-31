// import { useState } from 'react';

const HomepageAuthForm = () => {
  // const [userHasAccount, setUserHasAccount] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalToggle = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  // async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(`/api/fluid/${item.item._id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: username,
  //         firstName: firstName,
  //         lastName: lastName,
  //       }),
  //     });

  //     const fluidIntakeDoc = await response.json();
  //     alert(`You updated the current amount to: ${fluidIntakeDoc.amount}`);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-center">
              Welcome to the Holistic Health App
            </h1>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered"
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
                  required
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Already have an account? Login
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageAuthForm;
