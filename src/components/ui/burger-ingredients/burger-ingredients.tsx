import { IngredientsCategory } from '@components';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';

import type { BurgerIngredientsUIProps } from './type';

import styles from './burger-ingredients.module.css';

export const BurgerIngredientsUI = memo(function BurgerIngredientsUI({
  currentTab,
  buns,
  mains,
  sauces,
  titleBunRef,
  titleMainRef,
  titleSaucesRef,
  bunsRef,
  mainsRef,
  saucesRef,
  onTabClick,
}: BurgerIngredientsUIProps): React.JSX.Element {
  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab value="bun" active={currentTab === 'bun'} onClick={onTabClick}>
              Teig
            </Tab>
            <Tab value="main" active={currentTab === 'main'} onClick={onTabClick}>
              Belag
            </Tab>
            <Tab value="sauce" active={currentTab === 'sauce'} onClick={onTabClick}>
              Saucen
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          <IngredientsCategory
            title="Teig"
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
          />
          <IngredientsCategory
            title="Belag"
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
          />
          <IngredientsCategory
            title="Saucen"
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
          />
        </div>
      </section>
    </>
  );
});
