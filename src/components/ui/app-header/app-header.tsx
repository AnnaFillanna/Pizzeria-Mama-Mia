import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={styles.menu} aria-label="Hauptnavigation">
      <NavLink to="/" end className={styles.brand}>
        <span className={styles.brandIcon} aria-hidden="true">
          ✦
        </span>
        <span>
          Mamma <em>Mia</em>
          <small>PIZZERIA</small>
        </span>
      </NavLink>
      <div className={styles.links}>
        <NavLink to="/#lieblinge-title" className={styles.link}>
          Speisekarte
        </NavLink>
        <NavLink to="/#konfigurator" className={styles.link}>
          Pizza kreieren
        </NavLink>
        <NavLink to="/feed" className={styles.link}>
          Bestellungen
        </NavLink>
      </div>
      <NavLink to="/profile" className={styles.profile}>
        <span aria-hidden="true">♙</span>
        {userName ?? 'Mein Konto'}
      </NavLink>
    </nav>
  </header>
);
