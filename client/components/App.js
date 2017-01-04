import React from 'react';
import { Link, IndexLink } from 'react-router';
import classnames from 'classnames/bind';

// Using CSS Modules so we assign the styles to a variable
import s from './App.styl';
const cx = classnames.bind(s);
import logo from './react-logo.png';
import { Svg } from '../utils/svgHelpers.js';

// Favicon link is in the template, this just makes webpack package it up for us
import './favicon.ico';

const NavLink = props => (
  <Link activeClassName={cx('active')} {...props} />
);

const IndexNavLink = props => (
  <IndexLink activeClassName={cx('active')} {...props} />
);

// NOTE: This is currently unused but I kept it around as an example
const SvgGradient = () => (
  <Svg width='100%' height='100%'>
    <linearGradient id='g' x2='1' y2='1'>
      <stop stopColor='#F19' />
      <stop offset='100%' stopColor='#0CF' />
    </linearGradient>
    <rect width='100%' height='100%' fill='url(#g)' />
  </Svg>
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
        <nav className={cx('nav')}>
          <IndexNavLink to='/'>Home</IndexNavLink>
          <NavLink to='/algs'>Algorithms</NavLink>
          <NavLink to='/about'>About</NavLink>
          <NavLink to='/play'>Play</NavLink>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
