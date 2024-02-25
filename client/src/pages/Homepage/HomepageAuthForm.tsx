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
      <div className="min-h-screen md:min-h-96 bg-accents-300">
        <div className="flex flex-col lg:flex-row-reverse lg:justify-center lg:items-center px-4 py-14">
          <div className="text-center lg:text-left lg:pl-8">
            <h1 className="text-26 mb-2 md:mb-6 md:text-40 lg:text-56 text-primary-600 font-bold text-center font-playfair">
              Welcome to Holistic Health
            </h1>
          </div>
          <div className="card mt-4 mx-auto lg:mx-0 shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            {form}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageAuthForm;
