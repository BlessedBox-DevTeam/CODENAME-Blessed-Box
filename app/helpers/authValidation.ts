export type LoginValidationErrors = {
  email?: string;
  password?: string;
};

export function validateLoginInputs(email: string, password: string) {
  const errors: LoginValidationErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'The email is not valid.';
  }

  if (!password.trim()) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'The password must have at least 6 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
