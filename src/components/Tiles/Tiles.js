import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

const Tiles = (props) => {
  let tiles = 'No Feed Available';
  if (props.feeds && props.feeds !== {}) {
    tiles = props.feeds.map(item => (
      <Tile
        key={`tile ${item.id}`}
        {...item}
      />
    ));
  }

  return (
    <div id="tiles" className="tiles">
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
