import React from 'react';
import { Observable } from 'rxjs';
import * as d3 from 'd3';
import classnames from 'classnames/bind';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:InsertionSort'); // eslint-disable-line no-unused-vars

import s from './AlgIndex.styl';
const cx = classnames.bind(s);

// -----------------------------------------------------------------------------
//  TODO: Re-implement sorting on my own
//
//  This seems to have this odd concept of swaps to facilitate the
//  visualization. Is there another way to do this such that we can just run the
//  algorithm as is?
// -----------------------------------------------------------------------------
function quicksort(array) {
  var swaps = [];

  function partition(left, right, pivot) {
    var v = array[pivot];
    swap(pivot, --right);
    for (var i = left; i < right; ++i) if (array[i] <= v) swap(i, left++);
    swap(left, right);
    return left;
  }

  function swap(i, j) {
    if (i === j) return;
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    swaps.push([i, j]);
  }

  function recurse(left, right) {
    if (left < right - 1) {
      var pivot = partition(left, right, (left + right) >> 1);
      recurse(left, pivot);
      recurse(pivot + 1, right);
    }
  }

  recurse(0, array.length);
  return swaps;
}
// -----------------------------------------------------------------------------
// END TODO
// -----------------------------------------------------------------------------

class Viz extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const { data, width } = props;
    const n = data.length;

    this.xScale = d3.scalePoint()
      .domain(d3.range(n))
      .range([0, width]);

    this.angleScale = d3.scaleLinear()
      .domain([0, n - 1])
      .range([-45, 45]);
  }

  // NOTE: The units are crucial here since we are applying this as a CSS
  // attribute. If we were using the SVG transform attribute the units would not
  // matter, but they are very important when using CSS + SVG
  transform = (d, i) => {
    const { xScale, angleScale } = this;
    return `translate(${xScale(i)}px,${this.props.height}px)rotate(${angleScale(d)}deg)`;
  };

  render() {
    const { data, width, height } = this.props;
    const margin = {
      left: 40,
      right: 40,
      top: 80,
      bottom: 80,
    };
    const outerWidth = width + margin.left + margin.right;
    const outerHeight = height + margin.top + margin.bottom;

    return (
      <svg width={outerWidth} height={outerHeight}>
        <g
          className={cx('lines')}
          transform={`translate(${margin.left},${margin.top})`}>
          {data.map((x, i) => (
            <line
              key={x}
              y2={-height}
              stroke='white'
              style={{
                transitionDuration: '100ms',
                transform: this.transform(x, i),
              }}
            />
          ))}
        </g>
      </svg>
    );
  }
}

export default class InsertionSort extends React.Component {
  state = {
    data: d3.shuffle(d3.range(200)),
  };

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  reset = () => {
    if (this.sub) this.sub.unsubscribe();
    this.setState({
      data: d3.shuffle(d3.range(200)),
    });
  };

  start = () => {
    if (this.sub) this.sub.unsubscribe();

    const swap = (_arr, a, b) => {
      if (a === b) return _arr;

      const arr = _arr.slice(); // Immutable
      const _tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = _tmp;
      return arr;
    };

    let sortedData = this.state.data.slice();
    let swaps = quicksort(this.state.data.slice());
    let obs = Observable.from(swaps)
      .mergeMap((x, i) => Observable.of(x).delay(100 * i));

    this.sub = obs.subscribe(([a, b]) => {
      sortedData = swap(sortedData, a, b);
      this.setState({
        data: sortedData,
      });
    });
  };

  render() {
    return (
      <div className={cx('InsertionSort', 'page')}>
        <h1>InsertionSort</h1>
        <div className={cx('controls')}>
          <button className={cx('btn')} onClick={this.reset}>Reset</button>
          <button className={cx('btn')} onClick={this.start}>Start</button>
        </div>
        <div className={cx('vizContainer')}>
          <Viz
            data={this.state.data}
            width={600}
            height={40}
          />
        </div>
      </div>
    );
  }
}
