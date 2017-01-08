/* @flow */
import { compose } from 'ramda';

export class Maybe {
  static of = (x) => new Maybe(x);

  value: any;

  constructor(x: any) {
    this.value = x;
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(f: Function) {
    if (this.isNothing()) {
      return Maybe.of(null);
    } else {
      return Maybe.of(f(this.value));
    }
  }

  toString() {
    return `Maybe(${this.isNothing() ? 'null' : this.value.toString()})`;
  }
}

export class Left {
  static of = x => new Left(x);

  value: any;

  constructor(x: any) {
    this.value = x;
  }

  map(f: Function) {
    return this;
  }

  toString() {
    return `Left(${this.value})`;
  }
}

export class Right {
  static of = (x) => new Right(x);

  value: any;

  constructor(x: any) {
    this.value = x;
  }

  map(f: Function) {
    return Right.of(f(this.value));
  }

  toString() {
    return `Right(${this.value})`;
  }
}

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
