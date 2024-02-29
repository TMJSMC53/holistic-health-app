import FluidIntakeForm from './FluidIntakeForm';
import FluidIntakeLog from './FluidIntakeLog';
import CustomizableWaterIntakeGoalForm from './CustomizableWaterIntakeGoalForm';
import Footer from '../../components/Footer';
import CurrentUsername from './CurrentUsername';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../main.d';

type DashboardProps = {
  user: UserState;
};

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      // User is not logged in, redirect to login page
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div>
      <section className="flex items-center justify-between">
        <CurrentUsername firstName={user?.firstName || ''} />
        <CustomizableWaterIntakeGoalForm />
      </section>
      <>
        <FluidIntakeForm />
        <FluidIntakeLog />
      </>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Dashboard;
