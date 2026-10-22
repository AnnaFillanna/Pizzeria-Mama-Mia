import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { loginUser, loginDemoGuest } from '../../services/slices/authSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { Location } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;
  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password }));
  };
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return <Navigate to={from ?? '/'} replace />;
  }
  return (
    <LoginUI
      onDemoLogin={() => {
        void dispatch(loginDemoGuest());
      }}
      isLoading={isLoading}
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
