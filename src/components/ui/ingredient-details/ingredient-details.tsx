import { memo } from 'react';

import type { IngredientDetailsUIProps } from './type';

import styles from './ingredient-details.module.css';

export const IngredientDetailsUI = memo(function IngredientDetailsUI({
  ingredientData,
}: IngredientDetailsUIProps): React.JSX.Element {
  const { name, image_large, calories, proteins, fat, carbohydrates } = ingredientData;

  return (
    <div className={styles.content}>
      <img alt={`Produktbild: ${name}`} src={image_large} />
      <h3 className="text text_type_main-medium mt-2 mb-4">{name}</h3>
      <ul className={`${styles.nutritional_values} text_type_main-default`}>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Kalorien, kcal</p>
          <p className={`text text_type_digits-default`}>{calories}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Eiweiß, g</p>
          <p className={`text text_type_digits-default`}>{proteins}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Fett, g</p>
          <p className={`text text_type_digits-default`}>{fat}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className="text mb-2">Kohlenhydrate, g</p>
          <p className={`text text_type_digits-default`}>{carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
});
