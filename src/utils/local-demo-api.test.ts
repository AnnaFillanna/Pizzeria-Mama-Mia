import {
  getOrdersApi,
  getUserApi,
  loginDemoGuestApi,
  logoutApi,
  registerUserApi,
  submitDemoOrder,
  updateUserApi,
} from './local-demo-api';

const storage = (): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> => {
  const entries = new Map<string, string>();
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value): void => {
      entries.set(key, value);
    },
    removeItem: (key): void => {
      entries.delete(key);
    },
  };
};

beforeEach(() => {
  for (const key of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: storage() });
  }
});

test('guest never reads or changes the existing local profile or orders', async () => {
  await registerUserApi({
    name: 'Local profile',
    email: 'local@example.invalid',
    password: '',
  });
  await submitDemoOrder(['dough-classic']);
  const previousUser = localStorage.getItem('mamma-mia-demo-user');
  const previousOrders = localStorage.getItem('mamma-mia-demo-orders');
  await loginDemoGuestApi();
  expect((await getUserApi()).user).toEqual({
    name: 'Demo-Gast',
    email: '',
    isDemo: true,
  });
  expect(await getOrdersApi()).toEqual([]);
  await expect(updateUserApi({ email: 'changed@example.invalid' })).rejects.toThrow();
  await expect(updateUserApi({ password: 'changed' })).rejects.toThrow();
  await expect(updateUserApi({ name: 'changed' })).rejects.toThrow();
  await submitDemoOrder(['dough-classic']);
  expect(await getOrdersApi()).toHaveLength(1);
  expect(localStorage.getItem('mamma-mia-demo-user')).toBe(previousUser);
  expect(localStorage.getItem('mamma-mia-demo-orders')).toBe(previousOrders);
  await logoutApi();
  await loginDemoGuestApi();
  expect(await getOrdersApi()).toEqual([]);
});
