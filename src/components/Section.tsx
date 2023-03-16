import { type HTMLAttributes, type ReactNode, useCallback, useEffect } from 'react';

import { SectionContext, useHeadings, useSectionContext } from '~/hooks';
import { throwIfAllowed } from '~/lib';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  idPrefix?: string;
  offset?: number;
  onMissingHeading?: () => void;
}

export const Section = ({ children, offset = 0, onMissingHeading, ...props }: SectionProps) => {
  const { level } = useSectionContext();
  const [{ loaded, headings, id }, dispatch] = useHeadings();

  const addHeading = useCallback(
    (id: string, sectionLabel = false) => {
      dispatch({
        id,
        sectionLabel,
        type: 'add',
      });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({
      type: 'loaded',
    });
  }, []);

  useEffect(() => {
    if (loaded && (!headings || headings.length === 0)) {
      onMissingHeading?.();
      throwIfAllowed('No heading in Section!');
    }
  });

  return (
    <SectionContext.Provider value={{ addHeading, headings, id, level: level + 1 + offset }}>
      <section {...props} aria-labelledby={id ?? undefined}>
        {children}
      </section>
    </SectionContext.Provider>
  );
};
