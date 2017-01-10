/* @flow */
export const isNothing = (x: any) => (x === null || x === undefined);

export const Maybe = (x: any) => ({
  map: (f: Function) => Maybe(f(x)),
  fold: (f: Function) => f(x),
  isNothing: () => isNothing(x),
  toString: () => `Maybe(${isNothing(x) ? 'Nothing' : x.toString()})`,
});
