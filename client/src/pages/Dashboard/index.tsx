import FluidIntakeForm from '../Fluids/FluidIntakeForm';
import CustomizableWaterIntakeGoalForm from '../Fluids/CustomizableWaterIntakeGoalForm';
import CurrentUsername from './CurrentUsername';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../main.d';
import DailyMotivationalQuote from './DailyMotivationalQuote';
import NotesDashboard from './NotesDashboard';

import FluidIntakeDashboard from './FluidIntakeDashboard';

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
      <DailyMotivationalQuote />
      <section>
        <FluidIntakeForm />
      </section>
      <section className="flex flex-col justify-between md:flex-row">
        <FluidIntakeDashboard />
        <NotesDashboard />
      </section>
    </div>
  );
};

export default Dashboard;
