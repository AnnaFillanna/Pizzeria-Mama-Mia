import { useMemo } from 'react';

import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import {
  selectDough,
  selectSize,
  setToppings,
  toggleTopping,
} from '../../services/slices/pizzaSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  DOUGH_OPTIONS,
  PIZZA_INGREDIENTS,
  PIZZA_RECIPES,
  PIZZA_SIZES,
} from '../../utils/pizza-data';
import { calculatePizzaPrice, getOrderTotalCents } from '../../utils/pizza-pricing';

import styles from './constructor-page.module.css';

const groups = [
  { title: 'Saucen', types: ['sauce'] },
  { title: 'Käse', types: ['cheese'] },
  { title: 'Gemüse', types: ['vegetable'] },
  { title: 'Pilze', types: ['mushroom'] },
  { title: 'Weitere vegetarische Zutaten', types: ['vegetarian'] },
  { title: 'Fleisch & Fisch', types: ['meat', 'fish'] },
];

const euro = (value: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

export const ConstructorPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const pizza = useSelector((state) => state.pizza);
  const order = useSelector((state) => state.order.orderModalData);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderError = useSelector((state) => state.order.error);

  const dough =
    DOUGH_OPTIONS.find((item) => item._id === pizza.doughId) ?? DOUGH_OPTIONS[0];
  const size = PIZZA_SIZES.find((item) => item.id === pizza.size) ?? PIZZA_SIZES[1];
  const toppings = useMemo(
    () =>
      [...new Set(pizza.toppingIds)]
        .map((id) => PIZZA_INGREDIENTS.find((item) => item._id === id))
        .filter((item) => item !== undefined),
    [pizza.toppingIds]
  );
  const pricing = calculatePizzaPrice({
    size: pizza.size,
    doughId: dough._id,
    ingredientIds: pizza.toppingIds,
  });
  const total = pricing.totalCents / 100;

  const chooseRecipe = (ingredientIds: string[]): void => {
    dispatch(setToppings(ingredientIds));
    document.querySelector('#konfigurator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitOrder = (): void => {
    if (!toppings.length || orderRequest) return;
    void dispatch(
      createOrder({
        ingredientIds: toppings.map((item) => item._id),
        doughId: dough._id,
        size: pizza.size,
      })
    );
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PIZZA MIT HERZ · FRISCH AUS DEM OFEN</p>
          <h1>
            Ein Stück
            <br />
            <em>Italien</em> für dich.
          </h1>
          <p className={styles.heroText}>
            Handgemachter Teig, sonnengereifte Zutaten und ganz viel Amore. Stell dir
            deine Lieblingspizza zusammen.
          </p>
          <a
            className={styles.primaryLink}
            href="#/"
            onClick={(event) => {
              event.preventDefault();
              document
                .querySelector('#konfigurator')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Pizza kreieren <span aria-hidden="true">↓</span>
          </a>
          <p className={styles.deliveryNote}>Deine Zutaten · Deine Lieblingspizza</p>
        </div>
        <div className={styles.heroImage}>
          <img
            src={`${import.meta.env.BASE_URL}pizza-illustration.svg`}
            alt="Frisch gebackene Pizza mit Tomaten, Käse und Basilikum"
          />
          <span className={styles.heroBadge}>
            Fatto
            <br />
            con amore
          </span>
        </div>
      </section>

      <section className={styles.menuSection} aria-labelledby="lieblinge-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>AUS MAMMAS KÜCHE</p>
            <h2 id="lieblinge-title">Unsere Lieblinge</h2>
          </div>
          <p>
            Oder werde selbst zum Pizzaiolo und kreiere deine ganz eigene Kombination.
          </p>
        </div>
        <div className={styles.recipeGrid}>
          {PIZZA_RECIPES.map((recipe) => (
            <article className={styles.recipeCard} key={recipe.name}>
              <div className={styles.recipeImage}>
                <img
                  src={`${import.meta.env.BASE_URL}${recipe.image}`}
                  alt={`${recipe.imageLabel} Pizza`}
                />
              </div>
              <div className={styles.recipeContent}>
                <div>
                  <h3>{recipe.name}</h3>
                  <span>
                    {euro(
                      calculatePizzaPrice({
                        size: pizza.size,
                        doughId: dough._id,
                        ingredientIds: recipe.ingredientIds,
                      }).totalCents / 100
                    )}
                  </span>
                </div>
                <p>
                  {recipe.description}
                  <br />
                  {size.name} ({size.diameter}) · {dough.name}
                </p>
                <button type="button" onClick={() => chooseRecipe(recipe.ingredientIds)}>
                  Auswählen <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="konfigurator"
        className={styles.builderSection}
        aria-labelledby="builder-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>DEINE PIZZA, DEINE REGELN</p>
            <h2 id="builder-title">Werde Pizzaiolo</h2>
          </div>
          <p>
            Wähle deinen Lieblingsboden, die passende Größe und alles, was obendrauf
            gehört.
          </p>
        </div>

        <div className={styles.builderGrid}>
          <div className={styles.options}>
            <fieldset className={styles.optionGroup}>
              <legend>
                <span>01</span> Dein Teigboden
              </legend>
              <div className={styles.doughGrid}>
                {DOUGH_OPTIONS.map((option) => (
                  <label
                    className={`${styles.doughCard} ${pizza.doughId === option._id ? styles.selected : ''}`}
                    key={option._id}
                  >
                    <input
                      type="radio"
                      name="dough"
                      value={option._id}
                      checked={pizza.doughId === option._id}
                      onChange={() => dispatch(selectDough(option._id))}
                    />
                    <img className={styles.doughIcon} src={option.image} alt="" />
                    <span className={styles.doughName}>{option.name}</span>
                    <span className={styles.doughPrice}>
                      {option.price ? `+ ${euro(option.price)}` : 'Inklusive (0,00 €)'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.optionGroup}>
              <legend>
                <span>02</span> Die richtige Größe
              </legend>
              <div className={styles.sizeGrid}>
                {PIZZA_SIZES.map((option) => (
                  <button
                    className={`${styles.sizeCard} ${pizza.size === option.id ? styles.selected : ''}`}
                    type="button"
                    key={option.id}
                    aria-pressed={pizza.size === option.id}
                    onClick={() => dispatch(selectSize(option.id))}
                  >
                    <strong>{option.name}</strong>
                    <span>
                      {option.diameter} · {euro(option.basePriceCents / 100)}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.optionGroup}>
              <legend>
                <span>03</span> Dein Belag
              </legend>
              {groups.map((group) => {
                const groupItems = PIZZA_INGREDIENTS.filter((item) =>
                  group.types.includes(item.type)
                );
                return (
                  <div className={styles.toppingGroup} key={group.title}>
                    <h3>{group.title}</h3>
                    <div className={styles.toppingGrid}>
                      {groupItems.map((item) => {
                        const checked = pizza.toppingIds.includes(item._id);
                        return (
                          <label
                            className={`${styles.topping} ${checked ? styles.toppingSelected : ''}`}
                            key={item._id}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => dispatch(toggleTopping(item._id))}
                            />
                            <img
                              className={styles.ingredientImage}
                              src={item.image}
                              alt=""
                              loading="lazy"
                            />
                            <span>{item.name}</span>
                            <small>+ {euro(item.price)}</small>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </fieldset>
          </div>

          <aside className={styles.summary} aria-label="Deine Pizza im Überblick">
            <div className={styles.summaryImage}>
              <img
                src={`${import.meta.env.BASE_URL}pizzas/pizza-nach-wunsch.jpg`}
                alt="Pizza mit Mozzarella, Tomaten und Rucola"
              />
            </div>
            <p className={styles.eyebrow}>DEIN UNIKAT</p>
            <h3>Pizza nach Wunsch</h3>
            <p className={styles.summaryMeta}>
              {dough.name} · {size.name} ({size.diameter})
            </p>
            <ul className={styles.summaryList}>
              <li>
                <span>{pricing.sizeName} · Grundpreis</span>
                <span>{euro(pricing.basePriceCents / 100)}</span>
              </li>
              <li>
                <span>{pricing.doughName}</span>
                <span>
                  {pricing.doughPriceCents
                    ? `+ ${euro(pricing.doughPriceCents / 100)}`
                    : 'Inklusive (0,00 €)'}
                </span>
              </li>
              {toppings.map((item) => (
                <li key={item._id}>
                  <span className={styles.summaryIngredient}>
                    <img src={item.image} alt="" />
                    {item.name}
                  </span>
                  <span>{euro(item.price)}</span>
                </li>
              ))}
              {!toppings.length && (
                <li className={styles.emptySummary}>Wähle deinen Lieblingsbelag.</li>
              )}
            </ul>
            <div className={styles.totalRow}>
              <span>Gesamt</span>
              <strong>{euro(total)}</strong>
            </div>
            <button
              className={styles.orderButton}
              type="button"
              disabled={!toppings.length || orderRequest}
              onClick={submitOrder}
            >
              {orderRequest ? 'Wird zubereitet …' : 'Bestellung aufgeben'}
            </button>
            <p className={styles.demoNote}>
              Deine Auswahl wird in diesem Browser gespeichert.
            </p>
            {orderError && (
              <p className={styles.orderError} role="alert">
                {orderError}
              </p>
            )}
          </aside>
        </div>
      </section>

      {order && (
        <div className={styles.successBanner} role="status">
          <div>
            <strong>Grazie, deine Pizza ist bestellt!</strong>
            <span>
              Bestellung Nr. {order.number} · {euro(getOrderTotalCents(order) / 100)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearOrder())}
            aria-label="Bestellbestätigung schließen"
          >
            ×
          </button>
        </div>
      )}
      <footer className={styles.footer}>
        <span>Mamma Mia</span>
        <span>Mit Liebe gemacht. Für dich gebacken.</span>
        <span>© 2026 · Mamma Mia</span>
      </footer>
    </main>
  );
};
