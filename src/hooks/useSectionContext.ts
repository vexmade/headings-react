import { createContext, useContext } from 'react';

import { noop } from '~/lib';

interface SectionContextValues {
  addHeading: (id: string, sectionLabel?: boolean) => void;
  headings: string[] | null;
  id: string | null;
  level: number;
}

export const SectionContext = createContext<SectionContextValues>({
  addHeading: noop,
  headings: null,
  id: null,
  level: 0,
});

export const useSectionContext = () => useContext(SectionContext);
