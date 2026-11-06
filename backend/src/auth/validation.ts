export const validateEmail = (value: unknown): value is string => typeof value === 'string' && value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validatePassword = (value: unknown): value is string => typeof value === 'string' && value.length >= 12 && value.length <= 128;
export const validateUsername = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9_-]{3,100}$/.test(value);

