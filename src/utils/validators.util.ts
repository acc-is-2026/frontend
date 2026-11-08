export const normalizeEmail = (value: string) => {
  return value.trim().toLowerCase();
};

export const normalizeName = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};
