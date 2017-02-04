/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:Playground'); // eslint-disable-line no-unused-vars

import s from './Playground.styl';
const cx = classnames.bind(s);

const getThemeName = (bool) => bool ? 'light' : 'dark';

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

        <OptionsBox title='RxDB Logo Concept'>
          hey
        </OptionsBox>
      </div>
    );
  }
}
