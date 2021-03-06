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
  isEmpty,
  toUpper,
  test,
  tail,
  allPass,
  head,
  map,
  concat,
  always,
  groupBy,
  compose,
  toString,
  curry,
  curryN,
  path,
  identity,
  addIndex,
} from 'ramda';
import { Subject } from 'rxjs';
import type { Subscription } from 'rxjs';
import createDebugger from 'debug';

export const EMAIL_RE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const capitalize = (str) =>
  concat(toUpper(head(str)), tail(str));

const debug = createDebugger('alg-viz:components:Fp'); // eslint-disable-line no-unused-vars

import s from './FpExamples.styl';
const cx = classnames.bind(s);
import { Maybe, IO, Either, Validation } from '../../fp';

const { Success, Failure } = Validation;

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

export class Card extends React.Component {
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

const renderErrors = compose(
  addIndex(map)((msg, i) => (
    <div key={i} className={cx('alertError')}>{msg}</div>
  )),
);

const safeRenderErrors = compose(
  Either.either(always(null), renderErrors),
  Either.fromNullable,
);

type FancyInputProps = {
  key: string,
  value: string,
  onChange: (e: SyntheticKeyboardEvent) => void,
  errors?: Array<string>,
};
export const FancyInput = (props: FancyInputProps) => {
  return (
    <div key={props.key} className={cx('FancyInput')}>
      <input
        className={cx({ error: props.errors && props.errors.length })}
        placeholder={capitalize(props.key)}
        value={props.value}
        onChange={props.onChange}
      />
      {safeRenderErrors(props.errors)}
    </div>
  );
};

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

class MonadicValidationForm extends React.Component {
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
      compose(gt(__, 6), prop('length')),
    ]);

    const email = test(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    // Greater than 10 chars
    const password = compose(gt(__, 10), prop('length'));

    const usernameValid = x => username(x)
      ? Validation.Success(x)
      : Validation.Failure.of('Please provide a valid username');

    const emailValid = x => email(x)
      ? Validation.Success(x)
      : Validation.Failure.of('Please provide a valid email');

    const passwordValid = x => password(x)
      ? Validation.Success(x)
      : Validation.Failure.of('Please provide a valid password');

    const isValid = (un, em, pw) =>
      Validation.Success(curryN(3, always(true)))
        .ap(usernameValid(un))
        .ap(emailValid(em))
        .ap(passwordValid(pw));

    const { state } = this;
    isValid(state.username, state.email, state.password)
      .fold(
        (errors) => this.setState({ errors }),
        (x) => this.setState({ errors: [] }),
      );
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
        <h4>Monadic Form Validation</h4>
        <form className={cx('form')} onSubmit={this.validate}>
          {map(this.renderField, fields)}
          <button
            type='submit'
            className={cx('btn')}>
            Validate
          </button>
          {renderErrors(this.state.errors)}
        </form>
      </Card>
    );
  }
}

class FullValidationForm extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    errors: {
      username: [],
      email: [],
      password: [],
    },
  };

  resetErrors = () => {
    this.setState({
      errors: map(always([]), this.state.errors),
    });
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

    const notJustNumeric = complement(test(/^(0|[1-9][0-9]*)$/));

    // Just for a quick test
    const longerThan6 = compose(gt(__, 6), prop('length'));

    const isUsernameValid = (x) =>
      Success(curryN(2, always(x)))
        .ap(longerThan6(x)
          ? Success(x)
          : Failure.of({
            key: 'username',
            message: 'Username must be longer than 6',
          }))
        .ap(notJustNumeric(x)
          ? Success(x)
          : Failure.of({
            key: 'username',
            message: 'Username must not just be numbers',
          }));

    const isEmailValid = x =>
      test(EMAIL_RE, x)
        ? Success(x)
        : Failure.of({
          key: 'email',
          message: 'Email must be valid',
        });

    // Greater than 10 chars
    const longerThan10 = compose(gt(__, 10), prop('length'));
    const containsDigits = test(/\d/);
    const containsSpecialChars = test(/[!@#\$%\^\&*\)\(+=._-]+/);

    const isPasswordValid = x =>
      Success(curryN(3, always(x)))
        .ap(longerThan10(x)
          ? Success(x)
          : Failure.of({
            key: 'password',
            message: 'Password must be longer than 10 characters',
          }))
        .ap(containsDigits(x)
          ? Success(x)
          : Failure.of({
            key: 'password',
            message: 'Password must contain at least one digit',
          }))
        .ap(containsSpecialChars(x)
          ? Success(x)
          : Failure.of({
            key: 'password',
            message: 'Password must contain at least one special character ',
          }));

    const isValid = (un, em, pw) =>
      Success(curryN(3, always(true)))
        .ap(isUsernameValid(un))
        .ap(isEmailValid(em))
        .ap(isPasswordValid(pw));

    // Helper for turning [{ key: 'blah', message: '...' }]
    // into { blah: ['...'] }
    const messagesByKey = compose(
      map(map(prop('message'))), // Map once for the object, and again for the array values
      x => (debug(x), x),
      groupBy(prop('key')),
    );

    const { username, email, password } = this.state;

    isValid(username, email, password)
      .fold(
        (errors) => this.setState({ errors: messagesByKey(errors) }),
        this.resetErrors
      );
  };

  onChange = curry((k, e) => {
    this.setState({ [k]: e.target.value });
  });

  renderField = compose(
    FancyInput,
    (k) => ({
      key: k,
      value: this.state[k],
      onChange: this.onChange(k),
      errors: this.state.errors[k],
    })
  );

  render() {
    const fields = ['username', 'email', 'password'];
    return (
      <Card className={cx('full')}>
        <h4>Full Validation Example</h4>
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
        <p>The examples here are pretty cool, but the real fun is in the code.{' '}
          <a href='https://github.com/iansinnott/lab.iansinnott.com/blob/master/client/components/fp/FpExamples.js'>Check out the repo.</a>
        </p>
        <section className={cx('cards')}>
          <YouTubeSearch />
          <NullableRandom />
          <MaybeNullableRandom />
          <ThrowableRandom />
          <IOThrowableRandom />
          <ValidationForm />
          <MonadicValidationForm />
          <FullValidationForm />
        </section>
      </div>
    );
  }
}
