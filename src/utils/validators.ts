export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isValidPhone = (value: string): boolean => {
  return /^\d{10}$/.test(value.replace(/\D/g, ""));
};

export const isStrongPassword = (value: string): boolean => {
  return value.trim().length >= 8;
};
