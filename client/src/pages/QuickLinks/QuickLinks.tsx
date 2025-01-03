import QuickLinksViewAll from './QuickLinksViewAll';
import BackButton from '../../components/BackButton';
import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
type QuickLinksProps = {
  user: UserState;
};
const QuickLinks = ({ user }: QuickLinksProps) => {
  sendAuthenticatedUserToLoginPage(user);
  return (
    <>
      <div className="ml-4">
        <BackButton />
      </div>
      <QuickLinksViewAll user={user} />
    </>
  );
};

export default QuickLinks;
