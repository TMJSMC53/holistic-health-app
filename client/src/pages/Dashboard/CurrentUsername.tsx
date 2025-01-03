import BackButton from '../../components/BackButton';

type CurrentUserNameProps = {
  firstName: string;
};

const CurrentUsername = ({ firstName }: CurrentUserNameProps) => {
  return (
    <div className="flex flex-col">
      <div className="ml-4">
        <BackButton />
      </div>
      <h3 className="ml-4 text-18 md:text-22 lg:text-26 text-primary-600 font-poppins font-medium">
        Welcome Back, {firstName}
      </h3>
    </div>
  );
};

export default CurrentUsername;
