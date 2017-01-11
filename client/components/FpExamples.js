/* @flow */
import React from 'react';
import classnames from 'classnames/bind';
import { stringify } from 'querystring';
import {
  __,
  toPairs,
  complement,
  prop,
  reduce,
  gt,
  toUpper,
  test,
  tail,
  allPass,
  head,
  map,
  concat,
  compose,
  toString,
  curry,
  path,
  identity,
} from 'ramda';
import { Subject } from 'rxjs';
import type { Subscription } from 'rxjs';
import createDebugger from 'debug';

const capitalize = (str) =>
  concat(toUpper(head(str)), tail(str));

const debug = createDebugger('alg-viz:components:Fp'); // eslint-disable-line no-unused-vars

import s from './FpExamples.styl';
const cx = classnames.bind(s);
import { Maybe, IO, Either } from '../fp';

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
          <i className='fa fa-search'></i>
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

class MaybeNullableRandom extends React.Component {
  state = {
    value: Maybe(0),
  };

  randomize = () => {
    this.setState({ value: Maybe(nullableRandom()) });
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

class IOThrowableRandom extends React.Component {
  state = {
    value: '0',
  };

  randomize = () => {
    const io = IO(throwableRandom).map(toString);
    const value = Either.either(
      compose(concat('Caught! '), toString),
      identity,
    )(io);

    this.setState({ value });
  }

  render() {
    const { value } = this.state;
    const hasError = test(/Error/gi);

    return (
      <Card className={cx({ ohYes: hasError(value) })}>
        <h4><code>IO</code> Throwable Random</h4>
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

type InputProps = {
  key: string,
  value: string,
  onChange: (e: SyntheticKeyboardEvent) => void,
  error: boolean,
};
const Input = (props: InputProps) => (
  <input
    key={props.key}
    className={cx({ error: props.error })}
    placeholder={capitalize(props.key)}
    value={props.value}
    onChange={props.onChange}
  />
);

class ValidationForm extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    errors: [],
  };

  /**
   * This sort of works, but I'm still not super pleased with it. For instance,
   * where are the error messages? Where should I even store thos? I wrote it
   * this way to try to figure out what the big win of using a Validation type
   * might by.
   *
   * Currently it simply puts the key of any validation-offending state into the
   * return array.
   */
  validate = (e) => {
    e.preventDefault();

    const username = allPass([
      complement(test(/^(0|[1-9][0-9]*)$/)), // Not only digits
      compose(gt(__, 6) ,prop('length')),
    ]);

    const email = test(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    // Greater than 10 chars
    const password = compose(gt(__, 10), prop('length'));

    const validations = {
      username,
      email,
      password,
    };

    const runValidations = reduce((errs, [ key, predicate ]) => {
      if (!predicate(this.state[key])) errs.push(key);
      return errs;
    }, []);

    const errors = runValidations(toPairs(validations));

    this.setState({ errors });
  };

  onChange = curry((k, e) => {
    this.setState({ [k]: e.target.value });
  });

  renderField = compose(Input, (k) => ({
    key: k,
    value: this.state[k],
    onChange: this.onChange(k),
    error: this.state.errors.includes(k),
  }));

  render() {
    const fields = ['username', 'email', 'password'];
    return (
      <Card>
        <h4>Form Validation</h4>
        <form className={cx('form')} onSubmit={this.validate}>
          {map(this.renderField, fields)}
          <button
            type='submit'
            className={cx('btn')}>
            Validate
          </button>
        </form>
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
          <IOThrowableRandom />
          <ValidationForm />
        </section>
      </div>
    );
  }
}
