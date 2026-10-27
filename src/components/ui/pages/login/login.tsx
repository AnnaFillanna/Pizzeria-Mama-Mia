import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Input, Button, PasswordInput } from '../../form-controls';

import type { LoginUIProps } from './type';

import styles from '../common.module.css';

export const LoginUI = ({
  onDemoLogin,
  isLoading,
  email,
  setEmail,
  errorText,
  handleSubmit,
  password,
  setPassword,
}: LoginUIProps): React.JSX.Element => {
  const help = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const copyValue = async (value: string, label: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} kopiert.`);
    } catch {
      setCopyStatus('Bitte markiere den Text und kopiere ihn manuell.');
    }
  };
  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className="pb-6 text text_type_main-medium">Anmelden</h3>
        <div className="pb-6">
          <Button onClick={onDemoLogin} disabled={isLoading} type="secondary">
            Als Demo-Gast testen
          </Button>
          <p>Ohne Registrierung oder E-Mail-Adresse.</p>
        </div>
        <form className={`pb-15 ${styles.form}`} name="login" onSubmit={handleSubmit}>
          <>
            <div className="pb-6">
              <Input
                type="email"
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                error={false}
                errorText=""
                size="default"
              />
            </div>
            <div className="pb-6">
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="password"
              />
            </div>
            <div className={`pb-6 ${styles.button}`}>
              <Button type="primary" size="medium" htmlType="submit">
                Anmelden
              </Button>
            </div>
            {errorText && (
              <p className={`${styles.error} text text_type_main-default pb-6`}>
                {errorText}
              </p>
            )}
          </>
        </form>
        <button
          type="button"
          className={styles.helpTrigger}
          onClick={() => help.current?.showModal()}
          aria-haspopup="dialog"
        >
          Hilfe zur Demo
        </button>
        <dialog
          ref={help}
          className={styles.helpDialog}
          aria-labelledby="demo-help-title"
          onClose={() => setCopyStatus('')}
        >
          <button
            type="button"
            className={styles.helpClose}
            onClick={() => help.current?.close()}
            aria-label="Hilfe schließen"
          >
            Schließen ×
          </button>
          <h4 id="demo-help-title">Keine Registrierung nötig</h4>
          <p>
            Dies ist eine Demo. Verwende einfach diese Beispieldaten oder eine beliebige
            E-Mail-Adresse im gültigen Format und ein frei gewähltes Passwort. Bitte
            nutze keine echten Zugangsdaten.
          </p>
          <div className={styles.copyRow}>
            <div>
              <span>E-Mail</span>
              <strong>demo@example.com</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                void copyValue('demo@example.com', 'E-Mail');
              }}
              aria-label="E-Mail kopieren"
            >
              Kopieren
            </button>
          </div>
          <div className={styles.copyRow}>
            <div>
              <span>Passwort</span>
              <strong>Pizza123!</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                void copyValue('Pizza123!', 'Passwort');
              }}
              aria-label="Passwort kopieren"
            >
              Kopieren
            </button>
          </div>
          <p className={styles.copyStatus} role="status">
            {copyStatus}
          </p>
          <Button
            type="primary"
            htmlType="button"
            onClick={() => {
              setEmail('demo@example.com');
              setPassword('Pizza123!');
              help.current?.close();
            }}
          >
            Daten einfügen
          </Button>
          <p>Danach auf „Anmelden“ klicken und die Pizzeria ausprobieren.</p>
        </dialog>
        <div className={`pb-4 ${styles.question} text text_type_main-default`}>
          Noch kein Konto?
          <Link to="/register" className={`pl-2 ${styles.link}`}>
            Konto erstellen
          </Link>
        </div>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Passwort vergessen?
          <Link to={'/forgot-password'} className={`pl-2 ${styles.link}`}>
            Passwort zurücksetzen
          </Link>
        </div>
      </div>
    </main>
  );
};
