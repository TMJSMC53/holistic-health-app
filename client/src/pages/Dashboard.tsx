import FluidIntakeForm from '../components/FluidIntakeForm';
import FluidIntakeLog from '../components/FluidIntakeLog';

import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>

      <h1>Welcome back, username</h1>
      <>
        <FluidIntakeForm />
        <FluidIntakeLog />
      </>
    </div>
  );
};

export default Dashboard;
