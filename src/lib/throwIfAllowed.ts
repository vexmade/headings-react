import { isProd } from '~/lib/isProd';
import { isThrowErrorOverride } from '~/lib/isThrowErrorOverride';

export const throwIfAllowed = (message: string | Error) => {
  if (isThrowErrorOverride() || !isProd()) {
    throw message;
  }
};
