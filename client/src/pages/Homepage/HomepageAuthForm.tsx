import { useState } from 'react';
import HomepageRegisterForm from './HomepageRegisterForm';
import HomepageLoginForm from './HomepageLoginForm';

import { SetUser } from '../../main.d';

type HomepageAuthFormProps = {
  setUser: SetUser;
};
const HomepageAuthForm = ({ setUser }: HomepageAuthFormProps) => {
  const [currentForm, setCurrentForm] = useState('register');

  const switchForm = () => {
    if (currentForm === 'register') {
      setCurrentForm('login');
    } else {
      setCurrentForm('register');
    }
  };
  let form = null;

  if (currentForm === 'register') {
    form = <HomepageRegisterForm switchForm={switchForm} setUser={setUser} />;
  } else {
    form = <HomepageLoginForm switchForm={switchForm} setUser={setUser} />;
  }
  return (
    <>
      <div className="hero min-h-screen bg-blue-100">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-center">
              Welcome to the Holistic Health App
            </h1>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            {form}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageAuthForm;
