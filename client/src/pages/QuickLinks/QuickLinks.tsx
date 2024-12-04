import QuickLinksViewAll from './QuickLinksViewAll';

import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
type QuickLinksProps = {
  user: UserState;
};
const QuickLinks = ({ user }: QuickLinksProps) => {
  sendAuthenticatedUserToLoginPage(user);
  return (
    <>
      <QuickLinksViewAll user={user} />
    </>
  );
};

export default QuickLinks;
