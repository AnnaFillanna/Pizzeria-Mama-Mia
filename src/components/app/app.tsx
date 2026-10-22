import { AppHeader } from '@components';
import { ConstructorPage } from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Feed } from '../../pages/feed/feed';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { Login } from '../../pages/login/login';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { Profile } from '../../pages/profile/profile';
import { Register } from '../../pages/register/register';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { checkUserAuth } from '../../services/slices/authSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.items);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <aside className={styles.demoNotice} aria-label="Hinweis zur Demo-Version">
        <span className={styles.demoLabel}>DEMO</span>
        <p>Demo-Version – Alle Bestellungen dienen ausschließlich zu Testzwecken.</p>
      </aside>
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? new Error(ingredientsError) : null}
      />
    </div>
  );
};

export default App;

/* Der Katalog wird geladen, bevor Produkt- und Bestelldetails gerendert werden. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Der Pizzakatalog konnte nicht geladen werden
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Der Pizzakatalog ist leer.
      </p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/order/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title="Bestelldetails"
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title="Bestelldetails"
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title="Produktdetails"
              >
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
