import { UserState, SetUser } from '../main.d';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logout from './Logout';
import WebsiteVersion from './WebsiteVersion';

type NavbarProps = {
  user: UserState;
  setUser: SetUser;
};

const Navbar = ({ user, setUser }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      setIsOpen(true);
    }
  };

  //Back btn
  useEffect(() => {
    const onBackArrow = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('popstate', onBackArrow);

    return () => {
      window.removeEventListener('popstate', onBackArrow);
    };
  }, [isOpen]);

  return (
    <>
      <div className="drawer">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={toggleSidebar}
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar">
            <div className="flex-1 px-2 mx-2">
              <div className="mr-8">
                <WebsiteVersion />
              </div>
              <img
                className="block max-w-full rounded-full w-20 h-20"
                src="/images/HH_logo_nav.jpeg"
                alt="Navbar Holistic Health Logo"
              />
            </div>

            {/* Moved hamburger menu here */}
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>

            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal text-primary-600 font-poppins">
                {/* Navbar menu content here */}
                <li>
                  <Link to="/" className="hover:bg-transparent">
                    Home
                  </Link>
                </li>
                {user ? (
                  <>
                    <li className="text-primary-600">
                      <Link to="/dashboard" className="hover:bg-transparent">
                        Dashboard
                      </Link>
                    </li>
                    <li className="text-primary-600">
                      <Link to="/fluids" className="hover:bg-transparent">
                        Fluids
                      </Link>
                    </li>
                    <li className="text-primary-600">
                      <Link to="/note" className="hover:bg-transparent">
                        Notes
                      </Link>
                    </li>
                    <li className="text-primary-600">
                      <Link to="/quickLinks" className="hover:bg-transparent">
                        Quick Links
                      </Link>
                    </li>
                    <li className="text-primary-600">
                      <Link to="/habits" className="hover:bg-transparent">
                        Habits
                      </Link>
                    </li>
                  </>
                ) : null}
                <li>
                  <Link to="/about" className="hover:bg-transparent">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:bg-transparent">
                    Docs
                  </Link>
                </li>

                {user ? (
                  <li className="text-primary-600">
                    <Logout setUser={setUser} />
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>

        <div className={`drawer-side z-50 ${isOpen ? 'open' : ''}`}>
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu p-4 w-80 min-h-full bg-base-200">
            {/* Sidebar content here */}

            <li>
              <Link to="/" onClick={toggleSidebar}>
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="text-primary-600">
                  <Link to="/dashboard" onClick={toggleSidebar}>
                    Dashboard
                  </Link>
                </li>
                <li className="text-primary-600">
                  <Link to="/fluids" onClick={toggleSidebar}>
                    Fluids
                  </Link>
                </li>
                <li className="text-primary-600">
                  <Link to="/note" onClick={toggleSidebar}>
                    Notes
                  </Link>
                </li>
                <li className="text-primary-600">
                  <Link to="/quickLinks" onClick={toggleSidebar}>
                    Quick Links
                  </Link>
                </li>
                <li className="text-primary-600">
                  <Link to="/habits" onClick={toggleSidebar}>
                    Habits
                  </Link>
                </li>
              </>
            ) : null}

            <li>
              <Link to="/about" onClick={toggleSidebar}>
                About
              </Link>
            </li>
            <li>
              <Link to="/docs" onClick={toggleSidebar}>
                Docs
              </Link>
            </li>

            {user ? (
              <li className="text-primary-600">
                <Logout setUser={setUser} />
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
