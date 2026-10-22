import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '../../services/slices/authSlice';
import { useSelector, useDispatch } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  /** Lädt Kontodaten aus Redux. */
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (user?.isDemo) return;

    void dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password && { password: formValue.password }),
      })
    ).then((action) => {
      if (updateUser.fulfilled.match(action)) {
        setFormValue((prev) => ({
          ...prev,
          password: '',
        }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      isDemo={user?.isDemo}
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
