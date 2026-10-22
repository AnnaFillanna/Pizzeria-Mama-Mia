import { Link } from 'react-router-dom';

import { OrderCard } from '@components';

import type { OrdersListUIProps } from './type';

import styles from './orders-list.module.css';

export const OrdersListUI = ({ orderByDate }: OrdersListUIProps): React.JSX.Element => (
  <div className={`${styles.content}`}>
    {!orderByDate.length && (
      <div className="pizza-empty">
        <h2>Noch keine Bestellungen</h2>
        <p>Stelle deine erste Lieblingspizza zusammen.</p>
        <Link to="/" className="pizza-button">
          Pizza kreieren
        </Link>
      </div>
    )}
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} />
    ))}
  </div>
);
