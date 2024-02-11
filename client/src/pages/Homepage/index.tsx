import HomepageAuthForm from './HomepageAuthForm';
import ProductFeatures from './ProductFeatures';
import Footer from '../../components/Footer';
import { SetUser } from '../../main.d';

type HomepageProps = {
  setUser: SetUser;
};

const Homepage = ({ setUser }: HomepageProps) => {
  return (
    <div>
      <main>
        <HomepageAuthForm setUser={setUser} />
      </main>
      <ProductFeatures />
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Homepage;
