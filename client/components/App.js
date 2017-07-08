/* @flow */
import React from 'react';
import { Link, IndexLink } from 'react-router';
import classnames from 'classnames/bind';

// Using CSS Modules so we assign the styles to a variable
import s from './App.styl';
const cx = classnames.bind(s);
import logo from './react-logo.png';

// Favicon link is in the template, this just makes webpack package it up for us
import './favicon.ico';
import cssLogo from './css-logo.svg';
import svgLogo from './svg-logo.svg';

const NavLink = props => (
  <Link activeClassName={cx('active')} {...props} />
);

const IndexNavLink = props => (
  <IndexLink activeClassName={cx('active')} {...props} />
);

export class Home extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <img src={logo} alt='React Logo' />
          <h1>Lab</h1>
        </div>
        <p>Where I run experiments and learn by doing.</p>
        <p>
          This project was initially created to help visualize algorithms. I
          only ever got through quick-sort though, so that didn't really pan
          out. But I then started using this to play around with CSS animations
          and SVG. Then functional programming. Then some random stuff like{' '}
          <Link to='/playground'>creating a logo for RxDB</Link>.
        </p>
        <p>
          Now this is a place where I put anything. It's a good repo for testing
          out web tech and putting it online quickly.
        </p>
        <Link to='/css' className={cx('cta')}>
          CSS Fun
        </Link>
        <Link to='/svg' className={cx('cta')}>
          SVG Fun
        </Link>
        <Link to='/fp' className={cx('cta')}>
          Functional Programming
        </Link>
        <Link to='/form-validation' className={cx('cta')}>
          Form Validation
        </Link>
        <Link to='/playground' className={cx('cta')}>
          Misc
        </Link>
        <Link to='/algs' className={cx('cta')}>
          Algorithms
        </Link>
      </div>
    );
  }
}

export class NotFound extends React.Component {
  render() {
    return (
      <div className={cx('page', 'NotFound')}>
        <h1>Not Found...</h1>
        <p>(╭ರ_•́)</p>
        <Link to='/'>
          <i style={{ marginRight: 10 }} className='fa fa-long-arrow-left'></i>
          Back Home
        </Link>
      </div>
    );
  }
}

class Nav extends React.Component {
  render() {
    return (
      <nav className={cx('Nav')}>
        <IndexNavLink to='/'>Home</IndexNavLink>
        <NavLink to='/css' className={cx('hasImage')}>
          <img src={cssLogo} alt='CSS Logo' />
          <span className={cx('tooltip')}>CSS</span>
        </NavLink>
        <NavLink to='/svg' className={cx('hasImage')}>
          <img src={svgLogo} alt='CSS Logo' />
          <span className={cx('tooltip')}>SVG</span>
        </NavLink>
        <NavLink style={{ textTransform: 'none' }} to='/fp'>
          λ
          <span className={cx('tooltip')}>Functional Programming</span>
        </NavLink>
        <NavLink to='/playground'>Playground</NavLink>
        <NavLink to='/form-validation'>Form Validation</NavLink>
        <NavLink to='/algs'>
          Algs
          <span className={cx('tooltip')}>Algorithms</span>
        </NavLink>
      </nav>
    );
  }
}

/**
 * NOTE: As of 2015-11-09 react-transform does not support a functional
 * component as the base compoenent that's passed to ReactDOM.render, so we
 * still use createClass here.
 */
export class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <div className={cx('App')}>
        <Nav />
        <div className={cx('routeHandler')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
