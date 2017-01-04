import React from 'react';
import classnames from 'classnames/bind';

import s from './SvgPlayground.styl';
const cx = classnames.bind(s);
import { Svg, renderToDataUrl } from '../utils/svgHelpers.js';


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


class Box extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    title: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <section className={cx('Box')}>
        <h4>{this.props.title}</h4>
        <Svg
          width='100%'
          height={200}
          style={{ backgroundImage: renderToDataUrl(<SvgGrid opacity={0.2} />) }}>
          {this.props.children}
        </Svg>
      </section>
    );
  }
}

export default class Playground extends React.Component {
  render() {
    return (
      <div className={cx('Playground')}>
        <h1>Playground</h1>

        <Box title='rect'>
          <rect
            x={10}
            y={20}
            width={100}
            height={50}
            className={cx('shape')}
          />
        </Box>
      </div>
    );
  }
}
