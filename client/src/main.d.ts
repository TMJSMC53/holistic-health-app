export type User = {
  username: string;
  firstName: string;
  lastName: string;
};

export type SetUser = React.Dispatch<React.SetStateAction<UserState>>;

export type UserState = User | null | undefined;
