import React from 'react';
import classnames from 'classnames/bind';
import { stringify } from 'querystring';
import { curry, path } from 'ramda';
import { Subject } from 'rxjs';
import createDebugger from 'debug';

const debug = createDebugger('alg-viz:components:Fp'); // eslint-disable-line no-unused-vars

import s from './Fp.styl';
const cx = classnames.bind(s);

const FpSigil = () => (
  <div className={cx('FpSigil')}>λ</div>
);

const querystring = curry((query, url) => {
  return url + '?' + stringify(query);
});

const url = term => querystring({
  part: 'snippet',
  maxResults: 24,
  type: 'video',
  q: term,

  // NOTE: This would have to be a real api key for the request to actually go through
  key: 'xxxx',
}, 'https://www.googleapis.com/youtube/v3/search');

export default class Fp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.queries = new Subject()
      .map(path(['target', 'value']))
      .do(query => this.setState({ query }))
      .map(url)
      .do(x => debug('queried', x));

    this.sub = this.queries.subscribe();
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  /**
   * Pass the event through the subject. Unfortunately errors arrose passing
   * next directly in as the event handler...
   */
  handleChange = e => this.queries.next(e);

  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <FpSigil />
        </div>
        <p>Welcome to the Fp page...</p>
        <div className='search'>
          <input
            type='search'
            placeholder='Search...'
            value={this.state.query}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
