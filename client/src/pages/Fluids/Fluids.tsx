import FluidIntakeLog from '../Fluids/FluidIntakeLog';
import FluidIntakeByDays from '../Fluids/FluidIntakeByDays';

import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
import BackButton from '../../components/BackButton';
type FluidsProps = {
  user: UserState;
};
const Fluids = ({ user }: FluidsProps) => {
  sendAuthenticatedUserToLoginPage(user);
  return (
    <div>
      <div className="ml-4">
        <BackButton />
      </div>
      <FluidIntakeLog />
      <FluidIntakeByDays />
    </div>
  );
};

export default Fluids;
