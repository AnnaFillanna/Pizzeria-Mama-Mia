import type { TIngredient } from './types';

// Illustrative demo prices and nutrition estimates, not product specifications.
const catalog: [string, string, string, number, number, number, number, number][] = [
  ['dough-classic', 'Klassischer Teig', 'dough', 0, 8, 3, 48, 245],
  ['dough-wholegrain', 'Vollkornteig', 'dough', 1, 8, 3, 48, 245],
  ['dough-glutenfree', 'Glutenfreier Teig', 'dough', 2, 8, 3, 48, 245],
  ['sauce-tomato', 'Tomatensauce', 'sauce', 1, 2, 5, 8, 85],
  ['sauce-cream', 'Sahnesauce', 'sauce', 1.5, 2, 5, 8, 85],
  ['sauce-pesto', 'Basilikum-Pesto', 'sauce', 2, 2, 5, 8, 85],
  ['sauce-bbq', 'BBQ-Sauce', 'sauce', 1.5, 2, 5, 8, 85],
  ['veg-cucumber', 'Gurken', 'vegetable', 1, 1, 0, 5, 25],
  ['cheese-grated', 'Geriebener Mozzarella', 'cheese', 2, 20, 22, 2, 290],
  ['cheese-mozzarella', 'Mozzarella', 'cheese', 2.5, 20, 22, 2, 290],
  ['cheese-parmesan', 'Parmesan', 'cheese', 2, 20, 22, 2, 290],
  ['cheese-cheddar', 'Cheddar', 'cheese', 2, 20, 22, 2, 290],
  ['cheese-gorgonzola', 'Gorgonzola', 'cheese', 3, 20, 22, 2, 290],
  ['cheese-burrata', 'Burrata', 'cheese', 3.5, 20, 22, 2, 290],
  ['cheese-ricotta', 'Ricotta', 'cheese', 2, 20, 22, 2, 290],
  ['cheese-feta', 'Feta', 'cheese', 2, 20, 22, 2, 290],
  ['veg-tomato', 'Kirschtomaten', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-tomato-sliced', 'Tomatenscheiben', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-pepper', 'Rote Paprika', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-pepper-yellow', 'Gelbe Paprika', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-pepper-green', 'Grüne Paprika', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-onion', 'Rote Zwiebeln', 'vegetable', 1, 1, 0, 5, 25],
  ['veg-arugula', 'Rucola', 'vegetarian', 1, 3, 1, 6, 45],
  ['veg-basil', 'Frisches Basilikum', 'vegetarian', 1, 3, 1, 6, 45],
  ['mushroom-champignon', 'Champignons', 'mushroom', 1.5, 3, 0, 3, 22],
  ['mushroom-porcini', 'Steinpilze', 'mushroom', 2.5, 3, 0, 3, 22],
  ['veg-artichoke', 'Artischocken', 'vegetarian', 2, 3, 1, 6, 45],
  ['veg-olive', 'Schwarze Oliven', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-olive-green', 'Grüne Oliven', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-corn', 'Mais', 'vegetable', 1, 1, 0, 5, 25],
  ['veg-sundried', 'Getrocknete Tomaten', 'vegetable', 2, 1, 0, 5, 25],
  ['veg-pineapple', 'Ananas', 'vegetarian', 1.5, 3, 1, 6, 45],
  ['meat-salami', 'Salami', 'meat', 3, 22, 20, 2, 280],
  ['meat-ham', 'Schinken', 'meat', 2.5, 22, 20, 2, 280],
  ['meat-bacon', 'Bacon', 'meat', 2.5, 22, 20, 2, 280],
  ['meat-chicken', 'Hähnchen', 'meat', 3, 22, 20, 2, 280],
  ['fish-tuna', 'Thunfisch', 'fish', 2.5, 22, 7, 0, 155],
  ['fish-shrimp', 'Garnelen', 'fish', 3.5, 22, 7, 0, 155],
  ['fish-anchovy', 'Sardellen', 'fish', 2.5, 22, 7, 0, 155],
  ['meat-pepperoni', 'Peperoni-Salami', 'meat', 3, 22, 20, 2, 280],
  ['veg-chilli', 'Rote Chili', 'vegetable', 1, 1, 0, 5, 25],
  ['veg-jalapeno', 'Jalapeños', 'vegetable', 1, 1, 0, 5, 25],
  ['veg-spinach', 'Spinat', 'vegetarian', 1, 3, 1, 6, 45],
  ['herb-oregano', 'Oregano', 'vegetarian', 0.5, 3, 1, 6, 45],
  ['veg-capers', 'Kapern', 'vegetarian', 1, 3, 1, 6, 45],
  ['veg-tomato-halved', 'Halbierte Cherrytomaten', 'vegetable', 1.5, 1, 0, 5, 25],
  ['veg-pinenuts', 'Pinienkerne', 'vegetarian', 2, 3, 1, 6, 45],
  ['herb-rosemary', 'Rosmarin', 'vegetarian', 0.5, 3, 1, 6, 45],
];

export const PIZZA_INGREDIENTS: TIngredient[] = catalog.map(
  ([_id, name, type, price, proteins, fat, carbohydrates, calories]) => {
    const image = `./ingredients/${_id}.jpg`;
    return {
      _id,
      name,
      type,
      price,
      proteins,
      fat,
      carbohydrates,
      calories,
      image,
      image_large: image,
      image_mobile: image,
    };
  }
);

export const DOUGH_OPTIONS = PIZZA_INGREDIENTS.filter(
  (ingredient) => ingredient.type === 'dough'
);

export const PIZZA_SIZES = [
  { id: 'small', name: 'Klein', diameter: '24 cm', basePriceCents: 500 },
  { id: 'medium', name: 'Mittel', diameter: '30 cm', basePriceCents: 800 },
  { id: 'large', name: 'Groß', diameter: '36 cm', basePriceCents: 900 },
] as const;

export const PIZZA_RECIPES = [
  {
    name: 'Margherita',
    description: 'San Marzano, Fior di latte, Basilikum',
    ingredientIds: ['cheese-mozzarella', 'veg-tomato', 'veg-basil'],
    imageLabel: 'Margherita',
  },
  {
    name: 'Orto Verde',
    description: 'Paprika, Oliven, Artischocken, Mozzarella',
    ingredientIds: ['cheese-mozzarella', 'veg-pepper', 'veg-olive', 'veg-artichoke'],
    imageLabel: 'Orto Verde',
  },
  {
    name: 'Bosco',
    description: 'Steinpilze, Champignons, Parmesan',
    ingredientIds: ['mushroom-porcini', 'mushroom-champignon', 'cheese-parmesan'],
    imageLabel: 'Bosco',
  },
];
