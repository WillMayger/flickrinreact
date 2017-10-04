import React from 'react';
import PropTypes from 'prop-types';

const Search = props => (
  <div className="seach">
    <input
      type="text"
      onChange={e => props.onChange(e)}
      value={props.query}
    />
  </div>
);

Search.defaultProps = {
  query: '',
};

Search.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Search;
