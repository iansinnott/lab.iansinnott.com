/**
 * Generally _global will only ever be the window object, but I made it as a
 * function just in case.
 */
export default function exposeGlobals(_global) {
  Object.assign(_global, {
    d3: require('d3'),
  });
}
