import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
