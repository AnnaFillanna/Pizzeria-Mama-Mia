import { ProfileMenu } from '@components';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';

import type { ProfileUIProps } from './type';

import styles from './profile.module.css';

export const ProfileUI = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange,
}: ProfileUIProps): React.JSX.Element => (
  <main className={styles.container}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <form className={`mt-30 ${styles.form}`} onSubmit={handleSubmit}>
      <>
        <div className="pb-6">
          <Input
            type={'text'}
            placeholder={'Name'}
            onChange={handleInputChange}
            value={formValue.name}
            name={'name'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>
        <div className="pb-6">
          <Input
            type={'email'}
            placeholder={'E-mail'}
            onChange={handleInputChange}
            value={formValue.email}
            name={'email'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>
        <div className="pb-6">
          <Input
            type={'password'}
            placeholder={'Demo-Passwort (wird nicht gespeichert)'}
            onChange={handleInputChange}
            value={formValue.password}
            name={'password'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
          />
        </div>
        {isFormChanged && (
          <div>
            <Button
              type="secondary"
              htmlType="button"
              size="medium"
              onClick={handleCancel}
            >
              Abbrechen
            </Button>
            <Button type="primary" size="medium" htmlType="submit">
              Speichern
            </Button>
          </div>
        )}
        {updateUserError && (
          <p className={`${styles.error} pt-5 text text_type_main-default`}>
            {updateUserError}
          </p>
        )}
      </>
    </form>
  </main>
);
