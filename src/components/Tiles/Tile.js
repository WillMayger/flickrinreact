import React from 'react';
import PropTypes from 'prop-types';

const Tile = props => (
  <div className="tile">
    <div className="inner">
      <a href={props.link} title={props.title} target="_blank">
        <div className="thumb">
          <img src={props.media.m} title={props.title} alt={props.title} />
        </div>
      </a>
      <div className="text-container">
        <span className="title"><span>{props.title}</span></span>
        <span><a href={`https://www.flickr.com/people/${props.author_id}`} target="_blank" >By: {props.author}</a></span>
        <span className="tags">Tags: {props.tags}</span>
      </div>
    </div>
  </div>
);

Tile.propTypes = {
  media: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  author_id: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};

export default Tile;
