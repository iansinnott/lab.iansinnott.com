/* @flow */
import { compose } from 'ramda';

const isNothing = (x) => (x === null || x === undefined);

export const Maybe = (x: any) => ({
  map: (f: Function) => Maybe(f(x)),
  fold: (f: Function) => f(x),
  isNothing: () => isNothing(x),
  toString: () => `Maybe(${x ? x.toString() : 'null'})`,
});

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

export const tryCatch = (f: Function) => {
  try {
    return Right(f());
  } catch (err) {
    return Left(err);
  }
};

export class IO {
  static of = (f) => new IO(f);

  runIO: Function;

  constructor(f: Function) {
    this.runIO = f;
  }

  map(f: Function) {
    return IO.of(compose(f, this.runIO));
  }

  // Daf. How can I eliminate the need to try catch?? I want to write it ONLY
  // once. How am I supposed to handle code that might throw?? IO?
  chain(f: Function) {
    return f(this.runIO());
  }
}
