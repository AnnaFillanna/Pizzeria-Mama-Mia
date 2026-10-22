export type TPizzaPrice = {
  sizeName: string;
  basePriceCents: number;
  doughName: string;
  doughPriceCents: number;
  ingredients: { id: string; name: string; priceCents: number }[];
  totalCents: number;
};

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
  doughId?: string;
  size?: 'small' | 'medium' | 'large';
  totalPrice?: number;
  pricing?: TPizzaPrice;
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  isDemo?: boolean;
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: unknown;
};
