export const validateCredentials = (userid: string, password: string) => {
  const errors: string[] = [];

  if (!userid || userid.trim().length === 0) {
    errors.push("User ID is required");
  }

  if (userid && (userid.length < 3 || userid.length > 50)) {
    errors.push("User ID must be between 3 and 50 characters");
  }

  if (!password || password.length === 0) {
    errors.push("Password is required");
  }

  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
