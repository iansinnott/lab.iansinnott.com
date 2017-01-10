/* @flow */
import { curry } from 'ramda';

/**
 * Either itself is abstract and does not hav ea concrete implementation
 * here. It simply serves as namespace. Either represents the idea of
 * Either(Left, Right). All concrete interactions with Eithers happen with
 * either the `Left` or `Right` constructors.
 *
 * For example, to explicitly use Either as a namespace simply do:
 * import * as Either form './path/to/Either
 */

import { isNothing } from './maybe.js';

export const Right = (x: any) => ({
  map: (f: Function) => Right(f(x)),
  chain: (f: (a: any) => Right) => f(x),
  fold: (f: Function, g: Function) => g(x),
  toString: () => `Right(${x})`,
});

export const Left = (x: any) => ({
  map: (f: Function) => Left(x),
  chain: (f: Function) => Left(x),
  fold: (f: Function, g: Function) => f(x),
  toString: () => `Left(${x})`,
});

export const fromNullable = (x: any) => isNothing(x) ? Left(null) : Right(x);

export const tryCatch = (f: Function) => {
  try {
    return Right(f());
  } catch (err) {
    return Left(err);
  }
};

/**
 * Helper function to invoke the result of an either.
 */
export const either = curry((f, g, e) => {
  return e.fold(f, g);
});

