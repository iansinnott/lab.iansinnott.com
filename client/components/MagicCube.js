/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import {
  compose,
  test,
  prop,
  identity,
  always,
  pickAll,
  tap,
} from 'ramda';
import {
  scaleOrdinal,
  scaleLinear,
  schemeCategory10,
  color as toRgb,
} from 'd3';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:MagicCube'); // eslint-disable-line no-unused-vars

import s from './CssPlayground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';
import { IO } from '../fp';

const color = scaleOrdinal(schemeCategory10);

/**
 * Point tuple to hypotenuse. [ number, number ] -> number
 */
const hypot = (point) => Math.hypot(...point);

/**
 * Get the bounding client rect of a dom element.
 *
 * NOTE: The pick all is responsible for turning the ClientRect instance into a
 * plain object
 */
const getBoundingClientRect = el => IO(() => el.getBoundingClientRect())
  .map(pickAll(['top', 'bottom', 'left', 'right', 'width', 'height'])); // See NOTE

/**
 * This is only used to provide a default value when folding a bounding box.
 */
const getEmptyBoundingBox = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
});

const getRelativeMouseByEvent = e =>
  IO.of(e)
    .map(prop('currentTarget'))
    .chain(getBoundingClientRect)
    .map(pickAll(['left', 'top']))
    .map(({ left, top }) => [ e.clientX - left, e.clientY - top ]);

/**
 * Given mouse coordinates and the coordinates of the center of a shape,
 * determine which quadrant the mouse is in.
 *
 * Mathematically, this function should always return one of the cases
 * unless I made a calculation error. So this should never return the default
 * case of 'undefined...'
 */
const getQuadrant = ({ mouseX: x, mouseY: y, centerX, centerY }) =>
    (x < centerX  && y < centerY)  ? 'topLeft'
  : (x < centerX  && y >= centerY) ? 'bottomLeft'
  : (x >= centerX && y < centerY)  ? 'topRight'
  : (x >= centerX && y >= centerY) ? 'bottomRight'
  : 'Unknown...'; // Should never be hit

export default class MagicCube extends React.Component {
  gridBox: {
    getInnerDiv: () => Element,
  };

  xScale: Function;

  yScale: Function;

  rScale: Function;

  state: {
    mouseX: number,
    mouseY: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
  };

  constructor(props: any) {
    super(props);

    this.xScale = scaleLinear()
      .domain([1, -1]);
    this.yScale = scaleLinear()
      .domain([-1, 1]);
    this.rScale = scaleLinear()
      .domain([-45, 45]); // Will use Math.abs on scale result

    this.state = {
      mouseX: 0,
      mouseY: 0,
      centerX: 0,
      centerY: 0,
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const debugAndDefault = compose(getEmptyBoundingBox, tap(debug));
    getBoundingClientRect(this.gridBox.getInnerDiv())
      .fold(debugAndDefault, ({ width, height }) => {
        this.xScale.range([0, height]);
        this.yScale.range([0, width]); // Why do these depend on the opposite one?
        this.rScale.range([0, hypot([width, height])]);
        this.setState({
          width,
          height,
          centerX: width / 2,
          centerY: height / 2,
        });
      });
  }

  handleMouseMove = (e: SyntheticMouseEvent) => {
    const [ mouseX, mouseY ] = getRelativeMouseByEvent(e)
      .fold(always([ 0, 0 ]), identity);

    this.setState({ mouseX, mouseY });
  };

  getRotation = () => {
    const { xScale, yScale, rScale } = this;
    const { mouseX, mouseY } = this.state;

    const deg = (point) => {
      return Math.abs(rScale.invert(hypot(point)));
    };

    return `${xScale.invert(mouseY)}, ${yScale.invert(mouseX)}, 0, ${deg([mouseX, mouseY])}deg`;
  };

  render() {
    // Reverse the rotation of the eyes depending on the current quadrant so
    // that it appears the eyes are moving back and forth with the mouse
    const eyes = compose(
      style => <span style={style}>👀</span>,
      (quadrant) => ({
        display: 'block', // Necessary for rotation
        transform: `rotateY(${(test(/right/i, quadrant)) ? '180deg' : '0deg'})`,
      })
    );

    // Trim all the numbers in the rotation string to 3 decimal places
    const printRotation = str =>
      str.replace(/(-?\d+.\d+)/g, x => Number(x).toFixed(3));

    const stats = (state) => (
      <pre style={{
        position: 'absolute',
        top: 'auto',
        bottom: 0,
        left: 20,
      }}>
        x: {state.mouseX}
        <br />
        y: {state.mouseY}
        <br />
        quadrant: {getQuadrant(state)}
        <br />
        rotation: {printRotation(this.getRotation())}
      </pre>
    );

    const getColor = str => {
      const rgb = toRgb(color(str));
      rgb.opacity = 0.6;
      return rgb.toString();
    };

    return (
      <GridBox
        ref={el => (this.gridBox = el)}
        title='Cube'
        hover
        style={{ padding: 200 }}
        onMouseMove={this.handleMouseMove}>
        {stats(this.state)}
        <div className={cx('cubeContainer')}>
          <div
            className={cx('cube')}
            style={{
              transform: `rotate3d(${this.getRotation()})`,
            }}>
            {['front', 'back', 'right', 'left', 'top', 'bottom'].map(
              (face, i) => (
                <div
                  key={face}
                  className={cx('face', face)}
                  style={{ backgroundColor: getColor(face) }}>
                  {i === 0 ? eyes(getQuadrant(this.state)) : i + 1}
                </div>
              )
            )}
          </div>
        </div>
      </GridBox>
    );
  }
}
