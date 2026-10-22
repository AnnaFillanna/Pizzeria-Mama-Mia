import { useId, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';

type InputProps = Omit<ComponentProps<'input'>, 'size'> & {
  size?: string;
  error?: boolean;
  errorText?: string;
  icon?: string;
};
export const Input = ({
  size: _size,
  error,
  errorText,
  icon: _icon,
  placeholder,
  id,
  ...props
}: InputProps): React.JSX.Element => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="pizza-field">
      <label htmlFor={inputId}>{placeholder}</label>
      <input
        {...props}
        id={inputId}
        aria-invalid={error || undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
};
export const PasswordInput = (props: InputProps): React.JSX.Element => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="pizza-password">
      <Input
        {...props}
        placeholder={props.placeholder ?? 'Passwort'}
        type={visible ? 'text' : 'password'}
      />
      <button
        type="button"
        aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Verbergen' : 'Anzeigen'}
      </button>
    </div>
  );
};
type ButtonProps = Omit<ComponentProps<'button'>, 'type'> & {
  type?: 'primary' | 'secondary';
  htmlType?: 'button' | 'submit' | 'reset';
  size?: string;
  children?: ReactNode;
};
export const Button = ({
  type = 'primary',
  htmlType = 'button',
  size: _size,
  className = '',
  ...props
}: ButtonProps): React.JSX.Element => (
  <button
    {...props}
    type={htmlType}
    className={`pizza-button pizza-button-${type} ${className}`}
  />
);
