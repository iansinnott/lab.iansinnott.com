import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Link, IndexLink } from 'react-router';
import classnames from 'classnames/bind';
import { compose, curry } from 'ramda';

// Using CSS Modules so we assign the styles to a variable
import s from './App.styl';
const cx = classnames.bind(s);
import logo from './react-logo.png';

// Favicon link is in the template, this just makes webpack package it up for us
import './favicon.ico';

const NavLink = props => (
  <Link activeClassName={cx('active')} {...props} />
);

const IndexNavLink = props => (
  <IndexLink activeClassName={cx('active')} {...props} />
);

/**
 * Create an SVG with the appropriate namespace attached
 */
const Svg = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' {...props} />
);

/**
 * Render a transparent SVG grid which can be used as a repeatable pattern to
 * create a graph-paper-like effect on any background.
 */
class SvgGrid extends React.Component {
  static defaultProps = {
    opacity: 0.4,
  };

  static propTypes = {
    opacity: React.PropTypes.number.isRequired,
  };

  render() {
    const { opacity } = this.props;
    const innerGridColor = `rgba(255,255,255,${opacity / 2})`;
    const outerGridColor = `rgba(255,255,255,${opacity})`;
    return (
      <Svg width={100} height={100}>
        <rect width={100} height={100} fill='none' />
        <g fill={innerGridColor}>
          <rect width={100} height={1} y={20} />
          <rect width={100} height={1} y={40} />
          <rect width={100} height={1} y={60} />
          <rect width={100} height={1} y={80} />
          <rect width={1} height={100} x={20} />
          <rect width={1} height={100} x={40} />
          <rect width={1} height={100} x={60} />
          <rect width={1} height={100} x={80} />
        </g>
        <rect
          width={100}
          height={100}
          fill='none'
          strokeWidth={1}
          stroke={outerGridColor}
        />
      </Svg>
    );
  }
}

const prependDataUri = curry((mediaType, src) => `data:${mediaType},${src}`);

const renderToDataUri = compose(
  prependDataUri('image/svg+xml'),
  encodeURIComponent,
  renderToStaticMarkup,
);

const renderToDataUrl = compose(str => `url("${str}")`, renderToDataUri);

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
      <div
        className={cx('App')}
        style={{ backgroundImage: renderToDataUrl(<SvgGrid opacity={0.2} />) }}>
        <nav className={cx('nav')}>
          <IndexNavLink to='/'>Home</IndexNavLink>
          <NavLink to='/algs'>Algorithms</NavLink>
          <NavLink to='/about'>About</NavLink>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
