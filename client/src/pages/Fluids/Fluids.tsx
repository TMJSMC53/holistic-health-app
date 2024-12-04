import FluidIntakeLog from '../Fluids/FluidIntakeLog';
import FluidIntakeByDays from '../Fluids/FluidIntakeByDays';

import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
type FluidsProps = {
  user: UserState;
};
const Fluids = ({ user }: FluidsProps) => {
  sendAuthenticatedUserToLoginPage(user);
  return (
    <div>
      <FluidIntakeLog />
      <FluidIntakeByDays />
    </div>
  );
};

export default Fluids;
