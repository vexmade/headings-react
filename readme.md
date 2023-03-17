# Headings

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vexstudios_headings-react&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vexmade_headings-react)

A React package to handle a11y friendly dynamic `section`/`h#` generation.

## Usage

```tsx
import { H, Section } from '@vexmade/headings-react';

const SomeComponent = () => (
  <Section>
    <H>Heading</H>
    <div>Some other content</div>
    <Section>
      <H id="custom-id" sectionLabel>Multiple Headings</H>
      <H idPrefix="prefixed-" offset={1}>And multiple levels</H>
    </Section>
  </Section>
)
```

becomes

```html
<section aria-labelledby="1">
  <h1 id="1">Heading</h1>
  <div>Some other content</div>
  <section aria-labelledby="custom-id">
    <h2 id="custom-id">Multiple Headings</h2>
    <h3 id="prefixed-3">And multiple levels</h3>
  </section>
</section>
```
