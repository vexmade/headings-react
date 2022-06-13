import { ReactNode, useContext } from 'react';
import { SectionContext } from '~/components/Section';

interface HProps {
  children: ReactNode;
  level?: number;
  offset?: number;
}

export const H = ({ children, level = undefined, offset = 0 }: HProps) => {
  const { id = undefined, idUsed, level: contextLevel, setIdUsed } = useContext(SectionContext);

  const levelToUse = Math.max(1, level ?? contextLevel) + offset;

  const Heading = (levelToUse > 6 ? 'div' : `h${levelToUse}`) as keyof JSX.IntrinsicElements;
  const ariaLevel = levelToUse > 6 ? levelToUse : undefined;

  let myId = undefined;
  if (id && !idUsed.current) {
    myId = id;
    setIdUsed(true);
  }

  return (
    <Heading aria-level={ariaLevel} id={myId}>
      {children}
    </Heading>
  );
};
