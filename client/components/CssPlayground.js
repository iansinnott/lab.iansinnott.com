/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { compose, test, map, prop, identity, always, pickAll } from 'ramda';
import { range, scaleOrdinal, scaleLinear, schemeCategory10 } from 'd3';

import s from './CssPlayground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';
import { IO } from '../fp';

const color = scaleOrdinal(schemeCategory10);

const hypot = (point) => Math.hypot(...point);

const PerspectiveBox = (i) => (
  <div key={i} className={cx('PerspectiveBox')} />
);

/**
 * Get the bounding client rect of a dom element.
 *
 * NOTE: The pick all is responsible for turning the ClientRect instance into a
 * plain object
 */
const getBoundingClientRect = el => IO(() => el.getBoundingClientRect())
  .map(pickAll(['top', 'bottom', 'left', 'right', 'width', 'height'])); // See NOTE

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
const getQuadrant = ({ mouseX: x, mouseY: y, centerX, centerY }) => {
  return (x < centerX && y < centerY)   ? 'topLeft'
       : (x < centerX && y >= centerY)  ? 'bottomLeft'
       : (x >= centerX && y < centerY)  ? 'topRight'
       : (x >= centerX && y >= centerY) ? 'bottomRight'
       : 'Unknown...'; // Should never be hit
};

class MagicCube extends React.Component {
  gridBox: {
    getInnerDiv: () => Element,
  };

  xScale: Function;

  yScale: Function;

  constructor(props) {
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
    getBoundingClientRect(this.gridBox.getInnerDiv())
      .fold(getEmptyBoundingBox, ({ width, height }) => {
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

  handleMouseMove = (e) => {
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
    const eyes = compose(
      style => <span style={style}>👀</span>,
      (quadrant) => ({
        display: 'block', // Necessary for rotation
        transform: `rotateY(${(test(/right/i, quadrant)) ? '180deg' : '0deg'})`,
      })
    );

    const printRotation = str =>
      str.replace(/(-?\d+.\d+)/g, x => Number(x).toFixed(3));

    return (
      <GridBox
        ref={el => (this.gridBox = el)}
        title='Cube'
        hover
        style={{ padding: 200 }}
        onMouseMove={this.handleMouseMove}>
        <pre style={{
          position: 'absolute',
          top: 'auto',
          bottom: 0,
          left: 20,
        }}>
          x: {this.state.mouseX}
          <br />
          y: {this.state.mouseY}
          <br />
          quadrant: {getQuadrant(this.state)}
          <br />
          rotation: {printRotation(this.getRotation())}
        </pre>
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
                  style={{ backgroundColor: color(face) }}>
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

export default class CssPlayground extends React.Component {
  render() {
    return (
      <div className={cx('Playground')}>
        <h1>CSS Playground</h1>

        <GridBox title='Perspective' hover style={{ height: 300 }}>
          <div className={cx('perspective')} />
        </GridBox>

        <GridBox title='Multi Perspective' hover>
          <div className={cx('multiPerspective')}>
            {map(PerspectiveBox, range(9))}
          </div>
        </GridBox>

        <GridBox title='Z axis' hover style={{ height: 240 }}>
          <div className={cx('translateZ')}>
            <div className={cx('box')} />
          </div>
        </GridBox>

        <GridBox title='Card Flip' hover style={{ padding: 20 }}>
          <div className={cx('flipContainer')}>
            <div className={cx('card')}>
              <div className={cx('front')}>1</div>
              <div className={cx('back')}>2</div>
            </div>
          </div>
        </GridBox>

        <GridBox title='transform-origin' hover style={{ padding: 20 }}>
          <div className={cx('flipContainer', 'multi')}>
            <div className={cx('card', 'rightCenter')}>
              <div className={cx('front')}>
                1
                <pre>
                  transform-origin: right center{'\n'}
                  transform: translateX(-100%) rotateY(180deg)
                </pre>
              </div>
              <div className={cx('back')}>2</div>
            </div>
          </div>
          <div className={cx('flipContainer', 'multi')}>
            <div className={cx('card', 'leftCenter')}>
              <div className={cx('front')}>
                1
                <pre>
                  transform-origin: left center{'\n'}
                  transform: translateX(100%) rotateY(180deg)
                </pre>
              </div>
              <div className={cx('back')}>2</div>
            </div>
          </div>
        </GridBox>

        <MagicCube></MagicCube>
      </div>
    );
  }
}
