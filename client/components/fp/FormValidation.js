/* @flow weak */
import React from 'react';
import classnames from 'classnames/bind';
import createDebugger from 'debug';
import {
  __,
  complement,
  prop,
  gt,
  test,
  map,
  always,
  groupBy,
  compose,
  curry,
} from 'ramda';

const debug = createDebugger('app:components:FormValidation'); // eslint-disable-line no-unused-vars

import s from './FpExamples.styl';
const cx = classnames.bind(s);
import { Validation } from '../../fp';
const { validate, combineValidations } = Validation;
import { EMAIL_RE, Card, FancyInput } from './FpExamples.js';

/**
 * Our validations. These functions are very similar to predicates (they take a
 * predicate as the first arg) but instead of true or false they return
 * Validation.Success or Validation.Failure
 */
const notJustNumeric = validate(complement(test(/^(0|[1-9][0-9]*)$/)), {
  key: 'username',
  message: 'Username must not just be numbers',
});
const longerThan6 = validate(compose(gt(__, 6), prop('length')), {
  key: 'username',
  message: 'Username must be longer than 6',
});
const longerThan10 = validate(compose(gt(__, 10), prop('length')), {
  key: 'password',
  message: 'Password must be longer than 10 characters',
});
const containsDigits = validate(test(/\d/), {
  key: 'password',
  message: 'Password must contain at least one digit',
});
const containsSpecialChars = validate(test(/[!@#\$%\^\&*\)\(+=._-]+/), {
  key: 'password',
  message: 'Password must contain at least one special character ',
});
const isValidEmail = validate(test(EMAIL_RE), {
  key: 'email',
  message: 'Email must be valid',
});

class ValidationForm extends React.Component {
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

    const isUsernameValid = (x) => combineValidations(
      notJustNumeric(x),
      longerThan6(x),
    );

    const isPasswordValid = x => combineValidations(
      longerThan10(x),
      containsDigits(x),
      containsSpecialChars(x),
    );

    const isValid = (un, em, pw) => combineValidations(
      isUsernameValid(un),
      isValidEmail(em), // NOTE: We used this validation directly, see above
      isPasswordValid(pw),
    );

    const { username, email, password } = this.state;

    // Helper for turning [{ key: 'blah', message: '...' }]
    // into { blah: ['...'] }
    const messagesByKey = compose(
      map(map(prop('message'))), // Map once for the object, and again for the array values
      groupBy(prop('key')),
    );

    // Run it
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

export default class FormValidation extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <h1>Form Validation</h1>
        </div>
        <p>
          Form validation can be fun, but it can also be terrible. The problem
          is that it's usually terrible for the user. This example shows one way
          to handle form validation in a declarative, functional way without
          going crazy or introducing excessive new state.
        </p>
        <p>
          NOTE: There <em>will still be</em> state involved in displaying errors
          in the UI. We still need to know what validation errors have occurred
          at any given time.
        </p>
        <p>
          <a href='https://github.com/iansinnott/lab.iansinnott.com/blob/master/client/components/fp/FormValidation.js'>View source code</a>
        </p>
        <section className={cx('cards')}>
          <ValidationForm />
        </section>
      </div>
    );
  }
}
