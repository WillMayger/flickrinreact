import React from 'react';
import PropTypes from 'prop-types';
import Typist from 'react-typist';

const Search = props => (
  <div className="search-field">
    <div className={`auto-text ${props.clickedClass}`}>
      <Typist
        startDelay={500}
      >
        Keyword {props.type}...
      </Typist>
    </div>
    <input
      type="text"
      onClick={e => props.onClick(e)}
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
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  clickedClass: PropTypes.string.isRequired,
};

export default Search;
