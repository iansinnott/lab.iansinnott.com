import { renderToStaticMarkup } from 'react-dom/server';
import { compose, curry } from 'ramda';

export const prependDataUri = curry((mediaType, src) => `data:${mediaType},${src}`);

export const renderToDataUri = compose(
  prependDataUri('image/svg+xml'),
  encodeURIComponent,
  renderToStaticMarkup,
);

export const renderToDataUrl = compose(str => `url("${str}")`, renderToDataUri);

