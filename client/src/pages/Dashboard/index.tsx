import FluidIntakeForm from '../Fluids/FluidIntakeForm';
import CustomizableWaterIntakeGoalForm from '../Fluids/CustomizableWaterIntakeGoalForm';
import CurrentUsername from './CurrentUsername';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../../main.d';
import DailyMotivationalQuote from './DailyMotivationalQuote';
import QuickLinksCreateForm from '../QuickLinks/QuickLinksCreateForm';
import NotesDashboard from './NotesDashboard';

import FluidIntakeDashboard from './FluidIntakeDashboard';

import QuickLinks from './QuickLinksDashboardView';

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
        <QuickLinksCreateForm />
        <QuickLinks />
      </section>
      <div className="inset-0 mx-2">
        <div className="inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-700" />
      </div>
      <section>
        <FluidIntakeForm />
      </section>
      <section className="w-screen flex flex-col md:flex-row">
        <FluidIntakeDashboard />
        <NotesDashboard />
      </section>
    </div>
  );
};

export default Dashboard;
