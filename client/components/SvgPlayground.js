import React from 'react';
import classnames from 'classnames/bind';
import { range } from 'ramda';

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

class TweenBox extends React.Component {
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
  };

  static defaultProps = {
    width: '100%',
    height: 200,
  }

  state = {
    t: 0,
  };

  render() {
    return (
      <section className={cx('Box')}>
        <h4>{this.props.title}</h4>
        <button className={cx('btn')} onClick={this.start}>
          <i className='fa fa-play'></i>
          Start
        </button>
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

        <Box title='circle'>
          <circle
            cx={100}
            cy={100}
            r={50}
            className={cx('shape')}
          />
        </Box>

        <Box title='path'>
          <path
            d='M 10 10 L 200 10 L 50 100 Z'
            className={cx('shape')}
          />
        </Box>

        <Box title='text'>
          <text x='200' y='50' className={cx('shape')}>Hello world!</text>
          <text x='200' y='70' style={{ textAnchor: 'end' }} className={cx('shape')}>Hello world! </text>
          <text x='200' y='90' style={{ textAnchor: 'middle' }} className={cx('shape')}> Hello world! </text>
        </Box>

        <Box title='g'>
          <g transform='translate(100,100)' className={cx('shape')}>
            <circle cx={-50} cy={-20} r={20} />
            <circle cx={50} cy={-20} r={20} />
            <circle cx={0} cy={0} r={55} />
          </g>
        </Box>

        <Box title='nested groups'>
          <g transform='translate(200, 50)rotate(100)' className={cx('shape')}>
            <rect width={100} height={10} />
            <g transform='translate(100,0)rotate(-100)'>
              <rect width={100} height={10} />
              <g transform='translate(100,3)rotate(30)'>
                <rect transform='rotate(-40)' width={40} height={4} />
                <rect transform='rotate(-15)' width={40} height={4} y={0} />
                <rect transform='rotate(10)' width={40} height={4} y={0} />
              </g>
            </g>
          </g>
        </Box>

        <Box title='flower' height={750}>
          <g transform='translate(200,130)'>

            {/* Stem */}
            <path
              d='M0,0 L-40,200 L20,600'
              style={{
                stroke: '#2ecc71',
                strokeWidth: 20,
                fill: 'none',
              }}
            />

            {/* Flower */}
            <g>
              {range(0, 5).map(i => (
                <circle key={i}
                  r={60}
                  fill='#f1c40f'
                  transform={`rotate(${360*i/5})translate(40,0)scale(1.5,1)`}
                />
              ))}

              <circle r={60} fill='#f39c12' />
            </g>
          </g>
        </Box>

        <Box title='opacity'>
          <g className={cx('shape')} transform='translate(100,100)'>
            {range(0,5).map(i => (
              <circle
                key={i}
                r={30}
                fillOpacity={(i+1)/5}
                transform={`translate(${i*70/* diameter + 10 */})`}
              />
            ))}
          </g>
        </Box>

        <TweenBox title='animation I'>
          {({ t }) => (
            <g className={cx('shape')} transform='translate(100,100)'>
              {range(0,5).map(i => (
                <circle
                  key={i}
                  r={30}
                  fillOpacity={(i+1)/5}
                  transform={`translate(${(i*70*t)})`}
                />
              ))}
            </g>
          )}
        </TweenBox>
      </div>
    );
  }
}
