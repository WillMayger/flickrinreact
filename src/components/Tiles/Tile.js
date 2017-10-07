import React from 'react';
import PropTypes from 'prop-types';

const Tile = props => (
  <div className="tile">
    <div className="inner">
      <a href={`https://www.flickr.com/photos/${props.owner}/${props.id}`} title={props.title} target="_blank">
        <div className="thumb">
          <img src={`https://farm${props.farm}.staticflickr.com/${props.server}/${props.id}_${props.secret}.jpg`} title={props.title} alt={props.title} />
        </div>
      </a>
      <div className="text-container">
        <span className="title"><span>{props.title}</span></span>
        <span><a href={`https://www.flickr.com/people/${props.owner}`} target="_blank" >By: {props.ownername}</a></span>
        <span className="tags">Tags: {props.tags}</span>
      </div>
    </div>
  </div>
);

Tile.propTypes = {
  secret: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  farm: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  ownername: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};

export default Tile;
