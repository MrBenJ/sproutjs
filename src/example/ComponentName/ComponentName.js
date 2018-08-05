import React, { Component } from 'react';
import PropTypes from 'prop-types';

class <%= ComponentName %> extends Component {
  render() {
    const { className } = this.props;

    return (
      <div className={className}>{'<%= ComponentName %>'}</div>
    );
  }
}

<%= ComponentName %>.propTypes = {
  className: PropTypes.string
};

export default <%= ComponentName %>;
