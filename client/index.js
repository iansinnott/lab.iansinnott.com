/* @flow */
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import routes from './routes.js';
import exposeGlobals from './exposeGlobals.js';

if (process.env.NODE_ENV === 'development') {
  exposeGlobals(window);
}

browserHistory.listen(({ pathname, search }) => {
  window.ga('set', 'page', pathname + search);
  window.ga('send', 'pageview');
});

render((
  <Router routes={routes} history={browserHistory} />
), document.getElementById('root'));
