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
          <h1>Alg Viz</h1>
        </div>
        <p>A project to visually explain practical programming algorithms.</p>
        <Link to='/algs' className={cx('cta')}>
          View Algorithms
        </Link>
      </div>
    );
  }
}

export class About extends React.Component {
  render() {
    return (
      <div className={cx('page')}>
        <div className={cx('siteTitle')}>
          <h1>About Page</h1>
        </div>
        <p>Welcome to the about page...</p>
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
        <NavLink to='/algs'>
          Algs
          <span className={cx('tooltip')}>Algorithms</span>
        </NavLink>
        <NavLink style={{ textTransform: 'none' }} to='/fp'>
          λ
          <span className={cx('tooltip')}>Functional Programming</span>
        </NavLink>
        <NavLink to='/css' className={cx('hasImage')}>
          <img src={cssLogo} alt='CSS Logo' />
          <span className={cx('tooltip')}>CSS</span>
        </NavLink>
        <NavLink to='/svg' className={cx('hasImage')}>
          <img src={svgLogo} alt='CSS Logo' />
          <span className={cx('tooltip')}>SVG</span>
        </NavLink>
        <NavLink to='/playground'>Playground</NavLink>
        <NavLink to='/form-validation'>Form Validation</NavLink>
        <NavLink to='/about'>About</NavLink>
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
