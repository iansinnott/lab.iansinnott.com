/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { stringify } from 'querystring';
import { curry, path } from 'ramda';
import { Subject } from 'rxjs';
import type { Subscription } from 'rxjs';
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

class Card extends React.Component {
  props: {
    className?: string,
    children?: React.Element<*>,
  };

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={cx('Card', className)} {...props}>
        {this.props.children}
      </div>
    );
  }
}

class YouTubeSearch extends React.Component {
  state: { query: string };
  queries: Subject<Object>;
  sub: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.queries = new Subject();

    this.sub = this.queries
      .map(path(['target', 'value']))
      .do(query => this.setState({ query }))
      .map(url)
      .do(x => debug('queried', x))
      .subscribe();
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
      <Card className={cx('full')}>
        <div className={cx('search')}>
          <input
            type='search'
            placeholder='Search...'
            value={this.state.query}
            onChange={this.handleChange}
          />
        </div>
      </Card>
    );
  }
}

class Maybe {
  static of = (x) => new Maybe(x);

  constructor(x) {
    this.value = x;
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(f) {
    if (this.isNothing()) {
      return Maybe.of(null);
    } else {
      return Maybe.of(f(this.value));
    }
  }

  toString() {
    return `Maybe(${this.isNothing() ? 'null' : this.value.toString()})`;
  }
}

const nullableRandom = (threshold: number = 0.3) => {
  return (Math.random() < threshold) ? null : Math.random();
};

class NullableRandom extends React.Component {
  state = {
    value: 0,
  };

  randomize = () => {
    this.setState({ value: nullableRandom() });
  }

  render() {
    const { value } = this.state;
    return (
      <Card className={cx({ ohNo: value === null })}>
        <h4>Nullable Random</h4>
        <button onClick={this.randomize} className={cx('btn')}>
          Randomize!
        </button>
        <div className={cx('value')}>
          <code>{value === null ? 'null' : value}</code>
        </div>
      </Card>
    );
  }
}

window.Maybe = Maybe;

class MaybeNullableRandom extends React.Component {
  state = {
    value: Maybe.of(0),
  };

  randomize = () => {
    this.setState({ value: Maybe.of(nullableRandom()) });
  }

  render() {
    const { value } = this.state;
    return (
      <Card className={cx({ ohYes: value.isNothing() })}>
        <h4><code>Maybe</code> Nullable Random</h4>
        <button onClick={this.randomize} className={cx('btn')}>
          Randomize!
        </button>
        <div className={cx('value')}>
          <code>{value.toString()}</code>
        </div>
      </Card>
    );
  }
}

const throwableRandom = (threshold: number = 0.3) => {
  if (Math.random() < threshold) {
    throw new Error('A random error occurred');
  }

  return Math.random();
};

class ThrowableRandom extends React.Component {
  state = {
    value: 0,
  };

  randomize = () => {
    try {
      this.setState({ value: throwableRandom() });
    } catch (err) {
      this.setState({ value: err });
    }
  }

  render() {
    const { value } = this.state;
    return (
      <Card className={cx({ ohNo: (value instanceof Error) })}>
        <h4>Throwable Random</h4>
        <button onClick={this.randomize} className={cx('btn')}>
          Randomize!
        </button>
        <div className={cx('value')}>
          <code>{value.toString()}</code>
        </div>
      </Card>
    );
  }
}

export default class Fp extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <FpSigil />
        </div>
        <p>Welcome to the Fp page...</p>
        <section className={cx('cards')}>
          <YouTubeSearch />
          <NullableRandom />
          <MaybeNullableRandom />
          <ThrowableRandom />
        </section>
      </div>
    );
  }
}
