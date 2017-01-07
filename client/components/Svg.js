/* @flow weak */
import React from 'react';
import * as easings from 'd3-ease';
import type { Subscription } from 'rxjs';

import { renderToDataUrl } from '../utils/svgHelpers.js';
import createTweenObservable from '../utils/createTweenObservable.js';
import classnames from 'classnames/bind';

import s from './Svg.styl';
const cx = classnames.bind(s);

/**
 * Create an SVG with the appropriate namespace attached
 */
export const Svg = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' {...props} />
);

// NOTE: This is currently unused but I kept it around as an example
const SvgGradient = () => (
  <Svg width='100%' height='100%'>
    <linearGradient id='g' x2='1' y2='1'>
      <stop stopColor='#F19' />
      <stop offset='100%' stopColor='#0CF' />
    </linearGradient>
    <rect width='100%' height='100%' fill='url(#g)' />
  </Svg>
);

/**
 * Render a transparent SVG grid which can be used as a repeatable pattern to
 * create a graph-paper-like effect on any background.
 */
class SvgGrid extends React.Component {
  static defaultProps = {
    opacity: 0.4,
  };

  static propTypes = {
    opacity: React.PropTypes.number.isRequired,
  };

  render() {
    const { opacity } = this.props;
    const innerGridColor = `rgba(255,255,255,${opacity / 2})`;
    const outerGridColor = `rgba(255,255,255,${opacity})`;
    return (
      <Svg width={100} height={100}>
        <rect width={100} height={100} fill='none' />
        <g fill={innerGridColor}>
          <rect width={100} height={1} y={20} />
          <rect width={100} height={1} y={40} />
          <rect width={100} height={1} y={60} />
          <rect width={100} height={1} y={80} />
          <rect width={1} height={100} x={20} />
          <rect width={1} height={100} x={40} />
          <rect width={1} height={100} x={60} />
          <rect width={1} height={100} x={80} />
        </g>
        <rect
          width={100}
          height={100}
          fill='none'
          strokeWidth={1}
          stroke={outerGridColor}
        />
      </Svg>
    );
  }
}


export class Box extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired,
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired,
    ]),
  };

  static defaultProps = {
    width: '100%',
    height: 200,
  }

  render() {
    return (
      <section className={cx('Box')}>
        <h4>{this.props.title}</h4>
        <Svg
          width={this.props.width}
          height={this.props.height}
          style={{ backgroundImage: renderToDataUrl(<SvgGrid opacity={0.2} />) }}>
          {this.props.children}
        </Svg>
      </section>
    );
  }
}

const renderEasingOptions = (easings) => {
  return Object.keys(easings).map(k => (
    <option key={k} value={k}>{k}</option>
  ));
};

export class TweenBox extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired,
    ]),
    height: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired,
    ]),
    from: React.PropTypes.number.isRequired,
    to: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    defaultEasing: React.PropTypes.string.isRequired,
  };

  static defaultProps = {
    width: '100%',
    height: 200,
    from: 0,
    to: 1,
    duration: 1200,
    defaultEasing: 'easeBackOut',
  }

  sub: ?Subscription;

  state = {
    t: 0,
    started: false,
    complete: false,
    easing: this.props.defaultEasing,
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * A safe unsubscribe, in case there isn't an active subscription
   */
  unsubscribe = () => {
    this.sub && this.sub.unsubscribe();
  };

  start = () => {
    this.unsubscribe();

    const { from, to, duration } = this.props;
    const { easing } = this.state;

    this.setState({ started: true, complete: false });
    this.sub = createTweenObservable({
      from,
      to,
      duration,
      interval: 10,
      ease: easings[easing],
    }).subscribe(
      t => this.setState({ t }),
      null, // Omit error handler
      () => this.setState({ complete: true }),
    );
  };

  reset = () => {
    this.unsubscribe();
    this.setState({ t: 0, started: false, complete: false });
  };

  handleEasing = (e) => {
    this.setState({ easing: e.target.value }, this.start);
  };

  render() {
    const { started, complete } = this.state;
    return (
      <section className={cx('Box')}>
        <div className={cx('upper')}>
          <h4>{this.props.title}</h4>
          <div className={cx('controls')}>
            <button className={cx('btn')} onClick={this.start}>
              <i className='fa fa-play-circle'></i>
              {started ? 'Restart' : 'Start'}
            </button>
            <button className={cx('btn', 'control', { disabled: !complete })} onClick={this.reset}>
              <i className='fa fa-repeat'></i>
              Reset
            </button>
            <div className={cx('Select', 'control')}>
              <select
                className={cx('sel')}
                value={this.state.easing}
                onChange={this.handleEasing}>
                {renderEasingOptions(easings)}
              </select>
              <i className='fa fa-angle-down'></i>
            </div>
          </div>
        </div>
        <Svg
          width={this.props.width}
          height={this.props.height}
          style={{ backgroundImage: renderToDataUrl(<SvgGrid opacity={0.2} />) }}>
          {this.props.children(this.state)}
        </Svg>
      </section>
    );
  }
}

