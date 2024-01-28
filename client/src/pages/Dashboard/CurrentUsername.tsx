type CurrentUserNameProps = {
  firstName: string;
};

const CurrentUsername = ({ firstName }: CurrentUserNameProps) => {
  return <div>Welcome Back, {firstName}</div>;
};

export default CurrentUsername;
