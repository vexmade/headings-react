import { render, screen } from '@testing-library/react';

import { H, Section, SectionContext } from '~/index';

it('renders h1 by default', () => {
  render(<H>Some Text</H>);

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe('h1');
  expect(component).not.toHaveAttribute('id');
});

it.each`
  level | tagName  | checkLevel
  ${1}  | ${'h1'}  | ${false}
  ${6}  | ${'h6'}  | ${false}
  ${20} | ${'div'} | ${true}
`('can specify level to be [$level]', ({ checkLevel, level, tagName }) => {
  render(<H level={level}>Some Text</H>);

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe(tagName);
  expect(component).not.toHaveAttribute('id');
  if (checkLevel) {
    expect(component).toHaveAttribute('aria-level', `${level}`);
  }
});

it.each`
  offset | tagName  | checkLevel
  ${1}   | ${'h2'}  | ${false}
  ${9}   | ${'div'} | ${true}
`('can offset the level by [$offset]', ({ checkLevel, offset, tagName }) => {
  render(<H offset={offset}>Some Text</H>);

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe(tagName);
  expect(component).not.toHaveAttribute('id');
  if (checkLevel) {
    expect(component).toHaveAttribute('aria-level', `${offset + 1}`);
  }
});

it('defaults to h1 when wrapped with one Section', () => {
  let autoId;

  render(
    <Section>
      <H>Some Text</H>
      <SectionContext.Consumer>
        {({ id }) => {
          autoId = id;

          return null;
        }}
      </SectionContext.Consumer>
    </Section>,
  );

  const component = screen.getByText('Some Text');
  const section = component.closest('section') as HTMLElement;

  expect(component.tagName.toLowerCase()).toBe('h1');
  expect(component).toHaveAttribute('id', autoId);
  expect(section).toHaveAttribute('aria-labelledby', autoId);
});

it('only associates the first H to the parent Section', () => {
  let autoId;

  render(
    <Section>
      <H>Some Text</H>
      <H>Another Heading</H>
      <SectionContext.Consumer>
        {({ id }) => {
          autoId = id;

          return null;
        }}
      </SectionContext.Consumer>
    </Section>,
  );

  const headingWithId = screen.getByText('Some Text');
  const headingWithoutId = screen.getByText('Another Heading');

  expect(headingWithId).toHaveAttribute('id', autoId);
  expect(headingWithoutId).not.toHaveAttribute('id');
});

it('can have a custom prefix for the id', () => {
  let autoId = '';
  const idPrefix = 'my-prefix-';

  render(
    <Section idPrefix={idPrefix}>
      <H>Some Text</H>
      <SectionContext.Consumer>
        {({ id }) => {
          autoId = id || '';

          return null;
        }}
      </SectionContext.Consumer>
    </Section>,
  );

  const component = screen.getByText('Some Text');

  expect(component).toHaveAttribute('id', autoId);
  expect(autoId).toContain(idPrefix);
  expect(autoId.indexOf(idPrefix)).toBe(0);
});

it('is offset by the amount of ancestor Sections', () => {
  render(
    <Section>
      <H>Ignored</H>
      <Section>
        <H>Ignored</H>
        <Section>
          <H>Some Text</H>
        </Section>
      </Section>
    </Section>,
  );

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe('h3');
});

it('can offset a Section', () => {
  render(
    <Section offset={2}>
      <H>Some Text</H>
    </Section>,
  );

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe('h3');
});

it('offsets nested Sections', () => {
  render(
    <Section offset={2}>
      <H>Ignored</H>
      <Section>
        <H>Some Text</H>
      </Section>
    </Section>,
  );

  const component = screen.getByText('Some Text');

  expect(component.tagName.toLowerCase()).toBe('h4');
});

describe('Error Handling', () => {
  const getConsoleErrorMock = () => jest.spyOn(console, 'error').mockImplementation(jest.fn());

  let mockConsoleError = getConsoleErrorMock();
  let oldNodeEnv = process.env.NODE_ENV;
  let oldThrowErrors = process.env.HEADINGS_THROW_ERRORS;

  beforeEach(() => {
    jest.clearAllMocks()
    oldNodeEnv = process.env.NODE_ENV;
    oldThrowErrors = process.env.HEADINGS_THROW_ERRORS;
    mockConsoleError = getConsoleErrorMock();
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
    process.env.NODE_ENV = oldNodeEnv;
    process.env.HEADINGS_THROW_ERRORS = oldThrowErrors;
  });

  it('throws an error if a Section does not have an H', () => {
    expect(() =>
      render(
        <Section>
          <div>Some Text</div>
        </Section>,
      ),
    ).toThrow();
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
  });

  it('does not throw errors in Prod', () => {
    process.env.NODE_ENV = 'production';
    expect(() =>
      render(
        <Section>
          <div>Some Text</div>
        </Section>,
      ),
    ).not.toThrow();
    expect(mockConsoleError).toHaveBeenCalledTimes(0);
  });

  it('throws errors in Prod if forced', () => {
    process.env.NODE_ENV = 'production';
    process.env.HEADINGS_THROW_ERRORS = 'true';
    expect(() =>
      render(
        <Section>
          <div>Some Text</div>
        </Section>,
      ),
    ).toThrow();
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
  });
});
