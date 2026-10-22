import { PIZZA_INGREDIENTS } from './pizza-data';
import { calculatePizzaPrice } from './pizza-pricing';

import type { TIngredient, TOrder, TUser } from './types';

const ORDERS_KEY = 'mamma-mia-demo-orders';
const USER_KEY = 'mamma-mia-demo-user';
const GUEST_KEY = 'mamma-mia-guest-session';
const GUEST_ORDERS_KEY = 'mamma-mia-guest-orders';

// This is a local simulation, never a credential for a backend.
const isGuest = (): boolean =>
  typeof sessionStorage !== 'undefined' &&
  sessionStorage.getItem(GUEST_KEY) === 'active';
const guestUser = (): TUser => ({ name: 'Demo-Gast', email: '', isDemo: true });
const orderStorage = (): Storage => (isGuest() ? sessionStorage : localStorage);
const orderKey = (): string => (isGuest() ? GUEST_ORDERS_KEY : ORDERS_KEY);

export const loginDemoGuestApi = (): Promise<TAuthResponse> =>
  Promise.resolve().then(() => {
    if (!isGuest()) sessionStorage.removeItem(GUEST_ORDERS_KEY);
    sessionStorage.setItem(GUEST_KEY, 'active');
    return makeAuthResponse(guestUser());
  });

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
};

const readOrders = (): TOrder[] => {
  const storedOrders = orderStorage().getItem(orderKey());
  if (!storedOrders) return [];

  try {
    const parsedOrders: unknown = JSON.parse(storedOrders);
    if (Array.isArray(parsedOrders)) {
      const validOrders = parsedOrders.filter(isDemoOrder);
      if (validOrders.length !== parsedOrders.length) {
        console.error(
          'Ungültige Bestellungen wurden aus dem lokalen Verlauf ausgelassen.'
        );
      }
      return validOrders;
    }
  } catch (error) {
    console.error('Gespeicherte Bestellungen konnten nicht gelesen werden.', error);
  }

  return [];
};

const saveOrders = (orders: TOrder[]): void => {
  orderStorage().setItem(orderKey(), JSON.stringify(orders));
};

const readUser = (): TUser | null => {
  if (isGuest()) return guestUser();
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
    console.error('Gespeicherter Account konnte nicht gelesen werden.', error);
  }

  return null;
};

const saveUser = (user: TUser): void => {
  if (isGuest()) throw new Error('Profildaten sind im Demo-Modus gesperrt.');
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
    const size = Array.isArray(order) ? 'medium' : order.size;
    const doughId = Array.isArray(order)
      ? (order.find((id) =>
          PIZZA_INGREDIENTS.some((item) => item._id === id && item.type === 'dough')
        ) ?? 'dough-classic')
      : order.doughId;
    const pricing = calculatePizzaPrice({
      size,
      doughId,
      ingredientIds: Array.isArray(order) ? order : order.ingredientIds,
    });
    const ingredientIds = [doughId, ...pricing.ingredients.map((item) => item.id)];
    const existingOrders = readOrders();
    const now = new Date().toISOString();
    const number = Math.max(
      Date.now(),
      ...existingOrders.map((existingOrder) => existingOrder.number + 1)
    );
    const demoOrder: TOrder = {
      _id: `demo-${number}`,
      status: 'done',
      name: 'Deine Pizza nach Wunsch',
      createdAt: now,
      updatedAt: now,
      number,
      ingredients: ingredientIds,
      doughId,
      size,
      pricing,
      totalPrice: pricing.totalCents / 100,
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
    if (!user) throw new Error('Kein Konto angemeldet');
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
    if (isGuest()) {
      sessionStorage.removeItem(GUEST_KEY);
      sessionStorage.removeItem(GUEST_ORDERS_KEY);
    } else {
      localStorage.removeItem(USER_KEY);
    }
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
