import React from 'react';
import PropTypes from 'prop-types';

const Tile = props => (
  <div className="tile">
    <div className="inner">
      <div className="thumb">
        <img src={props.media.m} title={props.title} alt={props.title} />
      </div>
      <div className="text-container">
        <span><a href={props.photoLink} title={props.title}>{props.title}</a></span>
        <span><a href={props.authorLink} title={props.author}>{props.author}</a></span>
        <span>{props.description}</span>
        <span>{props.tags}</span>
        <span>{props.title}</span>
      </div>
    </div>
  </div>
);

Tile.defaultProps = {
  photoLink: '#',
  authorLink: '#',
};

Tile.propTypes = {
  media: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  photoLink: PropTypes.string,
  authorLink: PropTypes.string,
};

export default Tile;
