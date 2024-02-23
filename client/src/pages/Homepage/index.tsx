import HomepageAuthForm from './HomepageAuthForm';
import ProductFeatures from './ProductFeatures';
import Footer from '../../components/Footer';
import { SetUser } from '../../main.d';

type HomepageProps = {
  setUser: SetUser;
  isLoggedIn: boolean;
};

const Homepage = ({ setUser, isLoggedIn }: HomepageProps) => {
  return (
    <div>
      <main>
        {isLoggedIn ? (
          <div
            className="hero min-h-screen bg-primary-500
      "
          >
            <div className="hero-content flex-col lg:flex-row-reverse py-14">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl text-accents-100 font-bold text-center font-playfair">
                  Welcome Back to Holistic Health
                </h1>
              </div>
              <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <img
                  className="rounded"
                  src="/images/deniz-altindas-unsplash.jpg"
                  alt="Hero image"
                />
              </div>
            </div>
          </div>
        ) : (
          <HomepageAuthForm setUser={setUser} />
        )}
      </main>
      <ProductFeatures />
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Homepage;
