import React from 'react';
import PropTypes from 'prop-types';
import Typist from 'react-typist';

const Search = props => (
  <div className="search">
    <div>
      <div className={`auto-text ${props.clickedClass}`}>
        <Typist
          startDelay={500}
        >
        Keyword Search...
        </Typist>
      </div>
      <input
        type="text"
        onClick={e => props.onClick(e)}
        onChange={e => props.onChange(e)}
        value={props.query}
      />
    </div>
  </div>
);

Search.defaultProps = {
  query: '',
};

Search.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  clickedClass: PropTypes.string.isRequired,
};

export default Search;
