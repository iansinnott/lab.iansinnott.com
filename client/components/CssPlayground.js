/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { map } from 'ramda';
import { range, scaleOrdinal, schemeCategory10 } from 'd3';

import s from './CssPlayground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';

const color = scaleOrdinal(schemeCategory10);

const PerspectiveBox = (props) => (
  <div className={cx('PerspectiveBox')} />
);


export default class Playground extends React.Component {
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

        <GridBox title='Cube' hover style={{ padding: 20 }}>
          <div className={cx('cubeContainer')}>
            <div className={cx('cube')}>
              {['front', 'back', 'right', 'left', 'top', 'bottom']
               .map((face, i) => (
                 <div
                   key={face}
                   className={cx('face', face)}
                   style={{ backgroundColor: color(face) }}>
                   {i + 1}
                 </div>
              ))}
            </div>
          </div>
        </GridBox>

      </div>
    );
  }
}
