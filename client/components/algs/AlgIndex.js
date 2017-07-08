/* @flow */
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames/bind';

import s from './AlgIndex.styl';
const cx = classnames.bind(s);

export default class AlgIndex extends React.Component {
  render() {
    return (
      <div className={cx('AlgIndex', 'page')}>
        <h1>Here be algs</h1>
        <p>(But actually just one, because I never got around to coding up more...)</p>

        <div className={cx('list')}>
          <Link to='/algs/quick-sort'>Quick Sort</Link>
        </div>
      </div>
    );
  }
}
