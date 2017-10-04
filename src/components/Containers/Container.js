import React from 'react';
import PropTypes from 'prop-types';

const Container = props => (
  <div className="container-wrap">
    <div className={'container'}>
      <div className="row">
        {props.children}
      </div>
    </div>
  </div>
);

Container.defaultProps = {
  children: '',
};

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Container;
