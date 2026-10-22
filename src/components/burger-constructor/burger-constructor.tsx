import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { useSelector, useDispatch } from '../../services/store';
import { calculatePizzaPrice } from '../../utils/pizza-pricing';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** Liest Konstruktor- und Bestellstatus aus Redux. */
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredients));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      calculatePizzaPrice({
        size: 'medium',
        doughId: constructorItems.bun?._id ?? 'dough-classic',
        ingredientIds: constructorItems.ingredients.map((item) => item._id),
      }).totalCents / 100,
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
