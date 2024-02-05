import HomepageAuthForm from './HomepageAuthForm';
import ProductFeatures from './ProductFeatures';
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
    </div>
  );
};

export default Homepage;
