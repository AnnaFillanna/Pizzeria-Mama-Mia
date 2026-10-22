import { useEffect } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();
  useEffect(() => {
    const target = location.hash.slice(1);
    if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  }, [location]);
  return (
    <header className={styles.header}>
      <nav className={styles.menu} aria-label="Hauptnavigation">
        <NavLink to="/" end className={styles.brand}>
          <img
            className={styles.brandIcon}
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            width="48"
            height="48"
          />
          <span>
            Mamma <em>Mia</em>
            <small>PIZZERIA</small>
          </span>
        </NavLink>
        <div className={styles.links}>
          <NavLink
            to={{ pathname: '/', hash: '#lieblinge-title' }}
            className={styles.link}
          >
            Speisekarte
          </NavLink>
          <NavLink to={{ pathname: '/', hash: '#konfigurator' }} className={styles.link}>
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
};
