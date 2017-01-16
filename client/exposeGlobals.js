/**
 * Generally _global will only ever be the window object, but I made it as a
 * function just in case.
 *
 * @flow
 */
export default function exposeGlobals(_global: Object) {
  Object.assign(_global, {
    _: require('lodash/fp'),
    R: require('ramda'),
    I: require('immutable'),
    // Ex: require('immutable-ext'), // NOTE: This modifies Immutable prototypes
    Rx: require('rxjs'),
    d3: require('d3'),
    debug: require('debug'),
    fp: require('./fp'),
    utils: {
      createTweenObservable: require('./utils/createTweenObservable.js'),
    },
  });
}
