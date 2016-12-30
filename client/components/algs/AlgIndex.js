import React from 'react';
import { Link } from 'react-router';

export default class AlgIndex extends React.Component {
  render() {
    return (
      <div className='AlgIndex'>
        <h2>Here be algs</h2>

        <div className='list'>
          <Link to='/algs/insertion-sort'>Insertion Sort</Link>
        </div>
      </div>
    );
  }
}
