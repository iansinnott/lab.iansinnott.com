/* @flow */
import React, { PropTypes as T } from 'react';
import classnames from 'classnames/bind';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:Playground'); // eslint-disable-line no-unused-vars

import s from './Playground.styl';
const cx = classnames.bind(s);
import { GridBox } from './Svg.js';
import rxLogo from './rx-logo.png';

const getThemeName = (bool) => bool ? 'light' : 'dark';

class Cylinder extends React.Component {
  static propTypes = {
    size: T.number.isRequired,
  };

  static defaultProps = {
    size: 180,
  };

  render() {
    const { size } = this.props;
    return (
      <div style={{ width: 180, height: (90 * 0.77) }} className={cx('Cylinder')}>
        <div
          style={{ width: size, height: size }}
          className={cx('cylinderContainer')}>
          <div className={cx('cylinder')}>
            <div className={cx('dot')} />
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

class RxDbLogo extends React.Component {
  render() {
    return (
      <div className={cx('RxDbLogo')}>
        <Cylinder><img src={rxLogo} /></Cylinder>
        <Cylinder />
        <Cylinder />
        <div className={cx('line')} />
      </div>
    );
  }
}

class OptionsBox extends React.Component {
  state = {
    lightTheme: false,
  };

  toggleTheme = () => {
    this.setState({ lightTheme: !this.state.lightTheme });
  };

  render() {
    return (
      <div className={cx(
        'OptionsBox',
        'themed',
        getThemeName(this.state.lightTheme),
      )}>
        {this.props.children}
      </div>
    );
  }
}

export default class Playground extends React.Component {
  render() {
    return (
      <div className={cx('Playground')}>
        <h1>Playground</h1>
        <p>So much going on here!</p>

        <GridBox
          title='RxDB Logo Concept'
          style={{ paddingTop: 100, paddingBottom: 100 }}
          height={500}>
          <RxDbLogo />
        </GridBox>
      </div>
    );
  }
}
