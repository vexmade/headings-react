import { createContext, MutableRefObject, ReactNode, useContext, useEffect, useRef } from 'react';
import { useId } from '@reach/auto-id';

interface SectionProps {
  children: ReactNode;
  idPrefix?: string;
  offset?: number;
  onMissingHeading?: () => void;
}

interface SectionContextValues {
  id: string | undefined;
  idUsed: MutableRefObject<boolean>;
  level: number;
  setIdUsed: (to: boolean) => void;
}

const isProd = () => {
  return !process || process?.env?.NODE_ENV === 'production';
};

const isThrowErrorOverride = () => {
  return process?.env?.HEADINGS_THROW_ERRORS === 'true';
};

const throwIfAllowed = (message: string) => {
  if (isThrowErrorOverride() || !isProd()) {
    throw message;
  }
};

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const SectionContext = createContext<SectionContextValues>({
  id: undefined,
  idUsed: { current: false },
  level: 0,
  setIdUsed: noop,
});

export const Section = ({ children, idPrefix = 'section-', offset = 0, onMissingHeading }: SectionProps) => {
  const { level } = useContext(SectionContext);
  const autoId = useId();
  const id = autoId ? `${idPrefix}${autoId}` : undefined;
  const idUsed = useRef<boolean>(false);
  const setIdUsed = (to: boolean) => {
    idUsed.current = to;
  };

  useEffect(() => {
    if (id && !idUsed.current) {
      onMissingHeading?.();
      throwIfAllowed('No heading in Section!');
    }
  });

  return (
    <SectionContext.Provider value={{ id, idUsed, level: level + 1 + offset, setIdUsed }}>
      <section aria-labelledby={id}>{children}</section>
    </SectionContext.Provider>
  );
};
