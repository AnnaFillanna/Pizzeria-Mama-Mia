import { PIZZA_INGREDIENTS } from './pizza-data';

import type { TIngredient, TOrder, TUser } from './types';

const ORDERS_KEY = 'mamma-mia-demo-orders';
const USER_KEY = 'mamma-mia-demo-user';

const isDemoOrder = (value: unknown): value is TOrder =>
  typeof value === 'object' &&
  value !== null &&
  '_id' in value &&
  typeof value._id === 'string' &&
  'number' in value &&
  typeof value.number === 'number' &&
  'createdAt' in value &&
  typeof value.createdAt === 'string' &&
  'ingredients' in value &&
  Array.isArray(value.ingredients) &&
  value.ingredients.every((ingredient) => typeof ingredient === 'string');

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

type TServerResponse<T = unknown> = {
  success: boolean;
} & T;

type TAuthResponse = TServerResponse<{
  user: TUser;
}>;

export type TPizzaOrderInput = {
  ingredientIds: string[];
  doughId: string;
  size: 'small' | 'medium' | 'large';
  totalPrice: number;
};

const readOrders = (): TOrder[] => {
  const storedOrders = localStorage.getItem(ORDERS_KEY);
  if (!storedOrders) return [];

  try {
    const parsedOrders: unknown = JSON.parse(storedOrders);
    if (Array.isArray(parsedOrders)) {
      const validOrders = parsedOrders.filter(isDemoOrder);
      if (validOrders.length !== parsedOrders.length) {
        console.error(
          'Ungültige Demo-Bestellungen wurden aus dem lokalen Verlauf ausgelassen.'
        );
      }
      return validOrders;
    }
  } catch (error) {
    console.error('Gespeicherte Demo-Bestellungen konnten nicht gelesen werden.', error);
  }

  return [];
};

const saveOrders = (orders: TOrder[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const readUser = (): TUser | null => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    const parsedUser: unknown = JSON.parse(storedUser);
    if (
      typeof parsedUser === 'object' &&
      parsedUser !== null &&
      'name' in parsedUser &&
      typeof parsedUser.name === 'string' &&
      'email' in parsedUser &&
      typeof parsedUser.email === 'string'
    ) {
      return { name: parsedUser.name, email: parsedUser.email };
    }
  } catch (error) {
    console.error('Gespeicherter Demo-Account konnte nicht gelesen werden.', error);
  }

  return null;
};

const saveUser = (user: TUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const makeAuthResponse = (user: TUser): TAuthResponse => ({
  success: true,
  user,
});

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  Promise.resolve(PIZZA_INGREDIENTS);

export const getFeedsApi = (): Promise<
  TServerResponse<{ orders: TOrder[]; total: number; totalToday: number }>
> =>
  Promise.resolve().then(() => {
    const orders = readOrders();

    return {
      success: true,
      orders,
      total: orders.length,
      totalToday: orders.filter(
        (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
      ).length,
    };
  });

export const getOrdersApi = (): Promise<TOrder[]> => Promise.resolve().then(readOrders);

export const submitDemoOrder = (
  order: string[] | TPizzaOrderInput
): Promise<TServerResponse<{ order: TOrder; name: string }>> =>
  Promise.resolve().then(() => {
    const ingredientIds = Array.isArray(order)
      ? order
      : [order.doughId, ...order.ingredientIds];
    const existingOrders = readOrders();
    const now = new Date().toISOString();
    const number = Math.max(
      Date.now(),
      ...existingOrders.map((existingOrder) => existingOrder.number + 1)
    );
    const totalPrice = Array.isArray(order)
      ? ingredientIds.reduce(
          (total, id) =>
            total + (PIZZA_INGREDIENTS.find((item) => item._id === id)?.price ?? 0),
          0
        )
      : order.totalPrice;
    const demoOrder: TOrder = {
      _id: `demo-${number}`,
      status: 'done',
      name: 'Deine Pizza nach Wunsch',
      createdAt: now,
      updatedAt: now,
      number,
      ingredients: ingredientIds,
      ...(!Array.isArray(order) && {
        doughId: order.doughId,
        size: order.size,
      }),
      totalPrice,
    };

    saveOrders([demoOrder, ...existingOrders]);
    return { success: true, order: demoOrder, name: demoOrder.name };
  });

export const getOrderByNumberApi = (
  number: number
): Promise<TServerResponse<{ orders: TOrder[] }>> =>
  Promise.resolve().then(() => ({
    success: true,
    orders: readOrders().filter((order) => order.number === number),
  }));

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  Promise.resolve().then(() => {
    const user = { email: data.email, name: data.name };
    saveUser(user);
    return makeAuthResponse(user);
  });

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  Promise.resolve().then(() => {
    const savedUser = readUser();
    const user =
      savedUser?.email === data.email
        ? savedUser
        : { email: data.email, name: data.email.split('@')[0] || 'Pizza-Fan' };
    saveUser(user);
    return makeAuthResponse(user);
  });

export const getUserApi = (): Promise<TServerResponse<{ user: TUser }>> =>
  Promise.resolve().then(() => {
    const user = readUser();
    if (!user) throw new Error('Kein Demo-Konto angemeldet');
    return { success: true, user };
  });

export const updateUserApi = (
  userData: Partial<TRegisterData>
): Promise<TServerResponse<{ user: TUser }>> =>
  Promise.resolve().then(() => {
    const currentUser = readUser();
    if (!currentUser) throw new Error('Bitte melde dich zuerst an.');
    const user = {
      ...currentUser,
      ...(userData.name && { name: userData.name }),
      ...(userData.email && { email: userData.email }),
    };
    saveUser(user);
    return { success: true, user };
  });

export const logoutApi = (): Promise<TServerResponse> =>
  Promise.resolve().then(() => {
    localStorage.removeItem(USER_KEY);
    return { success: true };
  });

export const forgotPasswordApi = ({
  email,
}: {
  email: string;
}): Promise<TServerResponse> =>
  email.trim()
    ? Promise.resolve({ success: true })
    : Promise.reject(new Error('Bitte gib deine E-Mail-Adresse ein.'));

export const resetPasswordApi = ({
  password,
}: {
  password: string;
  token: string;
}): Promise<TServerResponse> =>
  password.trim()
    ? Promise.resolve({ success: true })
    : Promise.reject(new Error('Bitte gib ein neues Passwort ein.'));
