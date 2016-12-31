import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { compose, curry } from 'ramda';

/**
 * Create an SVG with the appropriate namespace attached
 */
export const Svg = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' {...props} />
);

export const prependDataUri = curry((mediaType, src) => `data:${mediaType},${src}`);

export const renderToDataUri = compose(
  prependDataUri('image/svg+xml'),
  encodeURIComponent,
  renderToStaticMarkup,
);

export const renderToDataUrl = compose(str => `url("${str}")`, renderToDataUri);

