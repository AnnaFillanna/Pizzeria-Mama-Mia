import { NavLink } from 'react-router-dom';

import type { ProfileMenuUIProps } from './type';

import styles from './profile-menu.module.css';

export const ProfileMenuUI = ({
  pathname,
  handleLogout,
}: ProfileMenuUIProps): React.JSX.Element => (
  <>
    <NavLink
      to={'/profile'}
      className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      }
      end
    >
      Profil
    </NavLink>
    <NavLink
      to={'/profile/orders'}
      className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      }
    >
      Bestellungen
    </NavLink>
    <button
      className={`text text_type_main-medium text_color_inactive pt-4 pb-4 ${styles.button}`}
      onClick={handleLogout}
    >
      Abmelden
    </button>
    <p className="pt-20 text text_type_main-default text_color_inactive">
      {pathname === '/profile'
        ? 'Hier kannst du deine Profildaten ändern.'
        : 'Hier findest du deine lokalen Bestellungen.'}
    </p>
  </>
);
