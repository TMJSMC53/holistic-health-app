import FluidIntakeForm from './FluidIntakeForm';
import FluidIntakeLog from './FluidIntakeLog';
import CustomizableWaterIntakeGoalForm from './CustomizableWaterIntakeGoalForm';
import CurrentUsername from './CurrentUsername';

import { User } from "../../main.d"

type DashboardProps = {
  user: User | null;
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
