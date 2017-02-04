/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { map } from 'ramda';
import { range } from 'd3';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:CssPlayground'); // eslint-disable-line no-unused-vars

import s from './CssPlayground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';
import MagicCube from './MagicCube.js';
import Carousel from './Carousel.js';

const PerspectiveBox = (i) => (
  <div key={i} className={cx('PerspectiveBox')} />
);

export default class CssPlayground extends React.Component {
  render() {
    return (
      <div className={cx('CssPlayground')}>
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

        <MagicCube />
        <Carousel />
      </div>
    );
  }
}
