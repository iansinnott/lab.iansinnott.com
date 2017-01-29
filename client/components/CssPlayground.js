/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { range } from 'd3';
import { map } from 'ramda';

import s from './CssPlayground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';

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

        <GridBox title='Card Flip' hover style={{
          perspective: 800,
          padding: 20,
        }}>
          <div className={cx('flipContainer')}>
            <div className={cx('card')}>
              <div className={cx('front')}>1</div>
              <div className={cx('back')}>2</div>
            </div>
          </div>
        </GridBox>
      </div>
    );
  }
}
