import React from 'react';
import PropTypes from 'prop-types';

const Tiles = (props) => {
  const tiles = props.feeds.map(item => (
    <Tiles
      key={`tile ${item.link}`}
      {...item}
    />
  ));
  return (
    <div className="tiles">
      <div className="inner">
        {tiles}
      </div>
    </div>
  );
};

Tiles.propTypes = {
  feeds: PropTypes.array.isRequired,
};

export default Tiles;
