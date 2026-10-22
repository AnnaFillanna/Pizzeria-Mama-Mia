import { PIZZA_INGREDIENTS, PIZZA_SIZES } from './pizza-data';

import type { TPizzaPrice, TOrder } from './types';

export type TPizzaSelection = {
  size: 'small' | 'medium' | 'large';
  doughId: string;
  ingredientIds: readonly string[];
};

/** Catalog prices use euros for compatibility; all arithmetic uses integer cents. */
export const toCents = (euros: number): number => Math.round(euros * 100);

export const calculatePizzaPrice = (selection: TPizzaSelection): TPizzaPrice => {
  const size = PIZZA_SIZES.find((item) => item.id === selection.size);
  const dough = PIZZA_INGREDIENTS.find(
    (item) => item._id === selection.doughId && item.type === 'dough'
  );
  if (!size || !dough) throw new Error('Ungültige Größe oder Teigart.');
  const ingredients = [...new Set(selection.ingredientIds)]
    .map((id) => {
      const item = PIZZA_INGREDIENTS.find((ingredient) => ingredient._id === id);
      if (!item) throw new Error(`Unbekannte Zutat: ${id}`);
      return item;
    })
    .filter((item) => item.type !== 'dough')
    .map((item) => ({ id: item._id, name: item.name, priceCents: toCents(item.price) }));
  const doughPriceCents = toCents(dough.price);
  return {
    sizeName: `${size.name} (${size.diameter})`,
    basePriceCents: size.basePriceCents,
    doughName: dough.name,
    doughPriceCents,
    ingredients,
    totalCents:
      size.basePriceCents +
      doughPriceCents +
      ingredients.reduce((sum, item) => sum + item.priceCents, 0),
  };
};

/** Historical orders retain their booked price, even after catalog changes. */
export const getOrderTotalCents = (order: TOrder): number => {
  if (order.pricing) return order.pricing.totalCents;
  if (typeof order.totalPrice === 'number' && Number.isFinite(order.totalPrice))
    return toCents(order.totalPrice);
  return calculatePizzaPrice({
    size: order.size ?? 'medium',
    doughId:
      order.doughId ??
      order.ingredients.find((id) =>
        PIZZA_INGREDIENTS.some((item) => item._id === id && item.type === 'dough')
      ) ??
      'dough-classic',
    ingredientIds: order.ingredients,
  }).totalCents;
};
