type CurrentUserNameProps = {
  firstName: string;
};

const CurrentUsername = ({ firstName }: CurrentUserNameProps) => {
  return (
    <h3 className="ml-4 text-18 font-poppins">Welcome Back, {firstName}</h3>
  );
};

export default CurrentUsername;
