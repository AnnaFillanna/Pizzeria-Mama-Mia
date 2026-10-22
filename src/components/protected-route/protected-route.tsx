import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector((state) => state.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const location = useLocation();
  if (!isAuthChecked) {
    return <div>Demo-Konto wird geprüft …</div>;
  }
  if (onlyUnAuth) {
    const from = (location.state as { from?: Location } | null)?.from;

    return user ? <Navigate to={from ?? '/'} replace /> : <Outlet />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
