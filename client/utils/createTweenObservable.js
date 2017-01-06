/* @flow */
import { Observable } from 'rxjs';
import { easeLinear } from 'd3-ease';

const DEFAULT_INTERVAL = 15;

const interpolate = (t, from, to) => {
  return ((to - from) * t) + from;
};

/**
 * Create a tween from one numeric value to another. This is useful for
 * animation and gradual transitions. The return value is an observable so to
 * make use of this you will need to call tween.subscribe(... ).
 *
 * An easing function is expected, and the default is linear. D3 conveniently
 * has many easing functions.
 *
 * D3 also has an interpolate method which could accomplish what our simple
 * function does and much more, however, since we don't yet interpolate over
 * anything other than numeric values it is of no use to us.
 *
 * https://github.com/d3/d3-interpolate
 */
type CreateTween = (options: {
  from: number,
  to: number,
  duration: number,
  interval?: number,
  ease?: (t: number) => number,
}) => Observable;

const createTween: CreateTween = ({
  from,
  to,
  duration,
  interval = DEFAULT_INTERVAL,
  ease = easeLinear,
}) => {
  const totalTicks = Math.round(duration / interval);
  return Observable.interval(interval)
    .take(totalTicks)
    .map(tick => {
      const t = tick / totalTicks;
      return interpolate(ease(t), from, to);
    })
    .concat(Observable.of(to));
};

export default createTween;
