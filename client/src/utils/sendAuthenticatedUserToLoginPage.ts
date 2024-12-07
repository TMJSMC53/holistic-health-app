import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserState } from '../main.d';

export default function useSendAuthenticatedUserToLoginPage(user: UserState) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // User is not logged in, redirect to login page
      navigate('/');
    }
  }, [user, navigate]);
}
