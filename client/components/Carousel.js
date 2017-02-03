/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { path } from 'ramda';
import {
  range,
  scaleOrdinal,
  schemeCategory20,
  color as toRgb,
} from 'd3';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:Carousel'); // eslint-disable-line no-unused-vars

import s from './Carousel.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';
import { IO } from '../fp';

const color = scaleOrdinal(schemeCategory20);

const getColor = (str, opacity = 0.8) => {
  const rgb = toRgb(color(str));
  rgb.opacity = opacity;
  return rgb.toString();
};

const getOuterTransform = (index) => `rotateY(${index * -40}deg)`;

export default class Carousel extends React.Component {
  state = {
    currentSlide: 0,
  };

  // Slider event. Value will be a string number
  handleSliderChange = (e: SyntheticEvent) => {
    IO.of(e)
      .map(path(['target', 'value']))
      .map(Number)
      .fold(debug, currentSlide => this.setState({ currentSlide }));
  };

  render() {
    return (
      <GridBox
        title='Carousel'
        slider
        sliderValue={this.state.currentSlide}
        onChange={this.handleSliderChange}
        style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className={cx('carouselContainer')}>
          <div
            className={cx('carousel')}
            style={{ transform: getOuterTransform(this.state.currentSlide) }}>
            {range(9).map(
              (face) => (
                <div
                  key={face}
                  className={cx('face')}
                  style={{
                    backgroundColor: getColor(String(face)),
                    borderColor: getColor(String(face), 1),
                  }}>
                  <span className={cx('inner')}>
                    {face ? (face + 1) : '😄'}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </GridBox>
    );
  }
}
