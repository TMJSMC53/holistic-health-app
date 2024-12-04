import { UserState } from '../../main.d';
import sendAuthenticatedUserToLoginPage from '../../utils/sendAuthenticatedUserToLoginPage';
type DocsProps = {
  user: UserState;
};
const Docs = ({ user }: DocsProps) => {
  sendAuthenticatedUserToLoginPage(user);
  return (
    <div className="my-10 ml-8 mr-8 md:mr-20 text-primary-600 font-poppins">
      <h2 className="text-26 md:text-36 text-primary-700 font-playfair">
        Feedback and Bug Reporting
      </h2>
      <p className="text-14 text-justify md:text-22 my-10">
        Your feedback is invaluable to us! If you encounter any issues or have
        suggestions for improvement, please&nbsp;
        <a
          className=" text-accents-200 hover:underline hover:underline-offset-4"
          href="https://github.com/TMJSMC53/holistic-health-app/issues"
          target="_blank"
        >
          create an issue on Github
        </a>
        &nbsp;to report them. Thank you for helping us enhance your experience!
      </p>
    </div>
  );
};

export default Docs;
