import React from 'react';
import { findDOMNode } from 'react-dom';
import { Observable } from 'rxjs';
import * as d3 from 'd3';
import classnames from 'classnames/bind';
import createDebugger from 'debug';
import { identity } from 'ramda';

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

// Try not to use `this` in here so that it can be easily refactored later.
// svg: D3$Selection
const renderSvg = (svg, props) => {
  const { height, data, xScale, angleScale, margin } = props;

  // NOTE: The units are crucial here since we are applying this as a CSS
  // attribute. If we were using the SVG transform attribute the units would not
  // matter, but they are very important when using CSS + SVG
  const transform = (d, i) => {
    return `translate(${xScale(i)}px,${height}px)rotate(${angleScale(d)}deg)`;
  };

  // We use a data join for the group to be declarative in our rendering. Since
  // the data is always the same we can call renderSvg repeatedly and it will
  // only render the group the first time
  const group = svg.selectAll(`.${cx('lines')}`).data([null]);

  const line = group
    .enter().append('g') // Enter <g>
      .attr('class', cx('lines'))
      .attr('transform', `translate(${margin.left},${margin.top})`)
    .merge(group)

      // Data join. Use the actual number that's being sorted for the join
      .selectAll('line')
      .data(data, identity);

  // NOTE: We use -height in order to make all the lines go UP, instead of
  // down. This gives the appearane that they are bottom-aligned, so tha the
  // bottom edge is a nice flat line while allt he rotated line endings are
  // jagged at the top
  line // Enter lines
      .enter().append('line')
        .attr('y2', -height) // See NOTE
        .attr('stroke', 'white')
        .style('transition-duration', '100ms')
      .merge(line)
        .style('transform', transform);
};

class Viz extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const { data } = props;

    const n = data.length;
    const width = 600;
    const height = 40;
    const margin = {
      left: 40,
      right: 40,
      top: 80,
      bottom: 80,
    };

    const outerWidth = width + margin.left + margin.right;
    const outerHeight = height + margin.top + margin.bottom;

    const xScale = d3.scalePoint()
      .domain(d3.range(n))
      .range([0, width]);

    const angleScale = d3.scaleLinear()
      .domain([0, n - 1])
      .range([-45, 45]);

    this.svgProps = {
      ...props,
      width,
      height,
      outerWidth,
      outerHeight,
      margin,
      xScale,
      angleScale,
    };
  }

  componentDidMount() {
    this.svg = d3.select(findDOMNode(this));
    this.svg.call(renderSvg, this.svgProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    debug('Re-rendering svg but not componenent');
    this.svg.call(renderSvg, {
      ...this.svgProps,
      data: nextProps.data,
    });

    // Do not render the svg itself
    return false;
  }

  render() {
    const { outerWidth, outerHeight } = this.svgProps;
    return (
      <svg width={outerWidth} height={outerHeight} />
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
          <Viz data={this.state.data} />
        </div>
      </div>
    );
  }
}
