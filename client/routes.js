/* @flow */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App, About, Home, NotFound } from './components/App.js';
import SvgPlayground from './components/SvgPlayground.js';
import CssPlayground from './components/CssPlayground.js';
import Playground from './components/Playground.js';
import Fp from './components/fp/FpExamples.js';
import FormValidation from './components/fp/FormValidation.js';
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
    <Route path='fp' title={makeTitle('FUNctional Programming')} component={Fp} />
    <Route path='css' title={makeTitle('CSS Playground')} component={CssPlayground} />
    <Route path='svg' title={makeTitle('SVG Playground')} component={SvgPlayground} />
    <Route path='playground' title={makeTitle('Playground')} component={Playground} />
    <Route path='form-validation' title={makeTitle('Form Validation')} component={FormValidation} />

    <Route path='about' title={makeTitle('About')} component={About} />
    <Route path='*' title='404: Not Found' component={NotFound} />
  </Route>
);

export default routes;
