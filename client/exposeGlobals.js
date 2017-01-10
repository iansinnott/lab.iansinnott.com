/**
 * Generally _global will only ever be the window object, but I made it as a
 * function just in case.
 *
 * @flow
 */
export default function exposeGlobals(_global: Object) {
  Object.assign(_global, {
    R: require('ramda'),
    Rx: require('rxjs'),
    d3: require('d3'),
    debug: require('debug'),
    utils: {
      createTweenObservable: require('./utils/createTweenObservable.js'),
    },
  });
}
