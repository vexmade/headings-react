export const isProd = () => {
  return !process || process?.env?.NODE_ENV === 'production';
};
