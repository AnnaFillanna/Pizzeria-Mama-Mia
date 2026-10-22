import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderByNumber } from '../../services/slices/orderInfoSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderTotalCents } from '../../utils/pizza-pricing';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const orderData = useSelector((state) => state.orderInfo.orderData);
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  /* Bereitet die gespeicherte Bestellung für die Anzeige auf. */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = getOrderTotalCents(orderData) / 100;

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
