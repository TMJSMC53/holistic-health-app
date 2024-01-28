import FluidIntakeForm from './FluidIntakeForm';
import FluidIntakeLog from './FluidIntakeLog';
import CustomizableWaterIntakeGoalForm from './CustomizableWaterIntakeGoalForm';
import CurrentUsername from './CurrentUsername';

type DashboardProps = {
  user?: {
    username: string;
    firstName: string;
    lastName: string;
  };
};
const Dashboard = ({ user }: DashboardProps) => {
  return (
    <div>
      <CurrentUsername firstName={user?.firstName || ''} />
      <>
        <CustomizableWaterIntakeGoalForm />
        <FluidIntakeForm />
        <FluidIntakeLog />
      </>
    </div>
  );
};

export default Dashboard;
