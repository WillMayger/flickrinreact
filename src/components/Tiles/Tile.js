import React from 'react';
import PropTypes from 'prop-types';

const Tile = props => (
  <div className="tile">
    <div className="inner">
      <a href={props.photoLink} title={props.title}>
        <div className="thumb">
          <img src={props.media.m} title={props.title} alt={props.title} />
        </div>
        <div className="text-container">
          <span className="title">{props.title}</span>
          <span>{props.author}</span>
          <span>{props.description} {props.authorLink}</span>
          <span>{props.tags}</span>
        </div>
      </a>
    </div>
  </div>
);
// a href={props.authorLink} title={props.author}>{props.author}</a>

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
