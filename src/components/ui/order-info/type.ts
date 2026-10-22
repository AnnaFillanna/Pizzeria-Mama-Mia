import type { TIngredient, TPizzaPrice } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
};

type TOrderInfo = {
  pricing?: TPizzaPrice;
  ingredientsInfo: Record<string, TIngredient & { count: number }>;
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
