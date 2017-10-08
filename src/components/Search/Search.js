import React from 'react';
import PropTypes from 'prop-types';

const Search = props => (
  <div className="search-field">
    <div className={`auto-text ${props.clickedClass}`}>
      {props.type()}
    </div>
    <input
      type="text"
      onBlur={e => props.onBlur(e)}
      onClick={e => props.onClick(e)}
      onChange={e => props.onChange(e)}
      value={props.query}
    />
  </div>
);

Search.propTypes = {
  query: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  type: PropTypes.func.isRequired,
  clickedClass: PropTypes.string.isRequired,
};

export default Search;
