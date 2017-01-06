import React from 'react';
import classnames from 'classnames/bind';
import { range } from 'ramda';

import s from './SvgPlayground.styl';
const cx = classnames.bind(s);
import { Box, TweenBox } from './Svg.js';

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
