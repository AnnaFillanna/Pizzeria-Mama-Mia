import {
  Input,
  Button,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { ResetPasswordUIProps } from './type';

import styles from '../common.module.css';

export const ResetPasswordUI = ({
  errorText,
  password,
  setPassword,
  handleSubmit,
  token,
  setToken,
}: ResetPasswordUIProps): React.JSX.Element => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className="pb-6 text text_type_main-medium">Demo-Passwort zurücksetzen</h3>
      <form className={`pb-15 ${styles.form}`} name="login" onSubmit={handleSubmit}>
        <div className="pb-6">
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
          />
        </div>
        <div className="pb-6">
          <Input
            type="text"
            placeholder="Demo-Code"
            onChange={(e) => setToken(e.target.value)}
            value={token}
            name="token"
            error={false}
            errorText=""
            size="default"
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type="primary" size="medium" htmlType="submit">
            Speichern
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Passwort wieder eingefallen?
        <Link to="/login" className={`pl-2 ${styles.link}`}>
          Anmelden
        </Link>
      </div>
    </div>
  </main>
);
