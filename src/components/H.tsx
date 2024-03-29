import { type HTMLAttributes, type ReactNode, useEffect } from 'react';
import { useId } from '@reach/auto-id';

import { useSectionContext } from '~/hooks';

interface HProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  idPrefix?: string;
  level?: number;
  offset?: number;
  sectionLabel?: boolean;
}

export const H = ({ children, id, idPrefix = '', level = undefined, offset = 0, sectionLabel, ...props }: HProps) => {
  const { addHeading, level: contextLevel } = useSectionContext();

  const levelToUse = Math.max(1, level ?? contextLevel) + Math.max(0, offset);

  const Heading = (levelToUse > 6 ? 'div' : `h${levelToUse}`) as keyof Pick<
    JSX.IntrinsicElements,
    'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >;
  const ariaLevel = levelToUse > 6 ? levelToUse : undefined;

  const myId = `${idPrefix}${useId(id)}`;

  useEffect(() => {
    if (myId) {
      addHeading(myId, sectionLabel);
    }
  }, []);

  return (
    <Heading {...props} aria-level={ariaLevel} id={myId}>
      {children}
    </Heading>
  );
};
