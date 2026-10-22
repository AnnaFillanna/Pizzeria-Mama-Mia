import { getOrdersApi, submitDemoOrder } from './local-demo-api';
import { PIZZA_RECIPES } from './pizza-data';
import { calculatePizzaPrice, getOrderTotalCents } from './pizza-pricing';

import type { TOrder } from './types';

const margherita = PIZZA_RECIPES[0].ingredientIds;
const selection = {
  size: 'medium' as const,
  doughId: 'dough-classic',
  ingredientIds: margherita,
};

describe('pizza prices in cents', () => {
  it.each([
    ['small', 500],
    ['medium', 800],
    ['large', 900],
  ] as const)('uses the %s base price without scaling toppings', (size, base) => {
    for (const [doughId, extra] of [
      ['dough-classic', 0],
      ['dough-wholegrain', 100],
      ['dough-glutenfree', 200],
    ] as const) {
      expect(
        calculatePizzaPrice({ ...selection, size, doughId, ingredientIds: [] })
          .totalCents
      ).toBe(base + extra);
      expect(calculatePizzaPrice({ ...selection, size, doughId }).totalCents).toBe(
        base + extra + 500
      );
    }
  });
  it('matches the 13 euro example and returns its full breakdown', () => {
    expect(calculatePizzaPrice(selection)).toMatchObject({
      basePriceCents: 800,
      doughPriceCents: 0,
      totalCents: 1300,
      ingredients: [
        { id: 'cheese-mozzarella', priceCents: 250 },
        { id: 'veg-tomato', priceCents: 150 },
        { id: 'veg-basil', priceCents: 100 },
      ],
    });
  });
  it('counts each selected ingredient and dough only once', () => {
    expect(
      calculatePizzaPrice({
        ...selection,
        ingredientIds: [...margherita, ...margherita, 'dough-classic', 'dough-classic'],
      }).totalCents
    ).toBe(1300);
  });
  it.each([
    [0, 1300],
    [1, 1550],
    [2, 1400],
  ])(
    'prices preset %i as its ingredients, without a recipe surcharge',
    (index, total) => {
      expect(
        calculatePizzaPrice({
          ...selection,
          ingredientIds: PIZZA_RECIPES[index].ingredientIds,
        }).totalCents
      ).toBe(total);
    }
  );
  it('rejects unknown selections instead of silently undercharging', () => {
    expect(() => calculatePizzaPrice({ ...selection, doughId: 'missing' })).toThrow();
    expect(() =>
      calculatePizzaPrice({ ...selection, ingredientIds: ['missing'] })
    ).toThrow();
  });
  it('preserves historical order totals', () => {
    expect(getOrderTotalCents({ totalPrice: 13.5 } as TOrder)).toBe(1350);
    expect(
      getOrderTotalCents({
        ingredients: margherita,
        size: 'medium',
        doughId: 'dough-classic',
      } as TOrder)
    ).toBe(1300);
  });
});

describe('stored order pricing', () => {
  beforeEach(() => {
    const entries = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string): string | null => entries.get(key) ?? null,
        setItem: (key: string, value: string): void => {
          entries.set(key, value);
        },
      },
    });
  });
  it('calculates the order itself and persists the cent breakdown', async () => {
    const { order } = await submitDemoOrder({
      ...selection,
      totalPrice: 1,
    } as typeof selection);
    expect(order.totalPrice).toBe(13);
    expect(order.pricing?.totalCents).toBe(1300);
    expect(order.ingredients).toEqual(['dough-classic', ...margherita]);
    expect((await getOrdersApi())[0]).toEqual(order);
  });
  it('normalizes the legacy array path without charging twice for dough', async () => {
    const { order } = await submitDemoOrder([
      'dough-wholegrain',
      ...margherita,
      'dough-wholegrain',
    ]);
    expect(getOrderTotalCents(order)).toBe(1400);
    expect(order.ingredients).toHaveLength(4);
  });
});
