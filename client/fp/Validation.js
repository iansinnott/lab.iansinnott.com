/**
 * Adding full on flow typing wasn't working because it could not understand
 * chaining. It kept on saying for instance that ap(blah).ap(blah2) was not
 * valid because the result of ap was `prototype`. Maybe this si getting
 * interpreted as looking for `ap` on the Object.prototype, but that seems odd.
 * Hopefully next version of flow will make this simpler.
 *
 * @flow weak
 */
import { isNothing } from './Maybe.js';

export const Success = (x: any) => ({
  value: x,
  isFailure: false,
  map: (f: Function) => Success(f(x)),
  fold: (f: Function, g: Function) => g(x),
  ap: (b: Success | Failure) => b.isFailure ? b : b.map(x),
  toString: () => `Success(${x})`,
});

Success.of = (x: any) => Success(x);

// For now Failure must take an array, because it needs to be concatable
export const Failure = (x: Array<any>) => ({
  value: x,
  isFailure: true,
  map: (f: Function) => Failure(x),
  fold: (f: Function, g: Function) => f(x),
  ap: (b: Success | Failure) =>
    b.isFailure ? Failure(x.concat(b.value)) : Failure(x), // Hm...
  toString: () => `Failure([${x.join(', ')}])`,
});

Failure.of = (x: any) => Failure([x]);

export const fromNullable = (x: any) => isNothing(x) ? Failure(x) : Success(x);

/**
 * NOTE: This is not strict, it will branch on whether the value is truthy or
 * falsey, not strictly true or false.
 *
 * I'm still really not sure what to call this method. But the idea is that you
 * provide the Failure
 */
export const successOr = (x: any) => (x) ? Success(x) : Failure(x);

