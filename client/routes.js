import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App, About, Home, NotFound } from './components/App.js';
import Playground from './components/SvgPlayground.js';
import AlgIndex from './components/algs/AlgIndex.js';
import QuickSort from './components/algs/QuickSort.js';

const makeTitle = str => str ? `Alg Viz | ${str}` : 'Alg Viz';

export const routes = (
  <Route path='/' component={App}>
    <IndexRoute title={makeTitle()} component={Home} />

    <Route path='algs'>
      <IndexRoute title={makeTitle('Algorithms')} component={AlgIndex} />
      <Route
        path='quick-sort'
        title={makeTitle('QuickSort')}
        component={QuickSort}
      />
    </Route>

    <Route path='play' title={makeTitle('Playground')} component={Playground} />

    <Route path='about' title={makeTitle('About')} component={About} />
    <Route path='*' title='404: Not Found' component={NotFound} />
  </Route>
);

export default routes;
