export const isThrowErrorOverride = () => {
  return process?.env?.HEADINGS_THROW_ERRORS === 'true';
};
