import React, { Component } from 'react';
import Container from './Containers/Container';
import Nav from './Nav/Nav';
import Search from './Search/Search';
import Tiles from './Tiles/Tiles';

export default class FlickrPage extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      feeds: [],
    };

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.callApi = this.callApi.bind(this);
  }

  componentDidMount() {
    this.callApi();
  }

  updateSearchQuery(e) {
    const query = e.target.value;
    this.setState({ query });
  }

  callApi() {
    fetch(
      '/services/feeds/photos_public.gne?format=json', {
        accept: 'application/json',
      },
    )
      .then(res => res.text())
      .then((string) => {
        // this is due to the json of flickr being invalid
        // when using the json feed.
        let jsonString = string;
        jsonString = jsonString.split('jsonFlickrFeed({').join('{');
        jsonString = jsonString.split('\\\'').join('\'');
        jsonString = jsonString.replace(/.$/, '');
        return JSON.parse(jsonString);
      })
      .then((json) => {
        const feeds = json.items;
        this.setState({ feeds });
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.state.feeds);
    return (
      <div className="wrap">
        <Container>
          <Nav />
        </Container>

        <Container>
          <Search
            onChange={this.updateSearchQuery}
            query={this.state.query}
          />
        </Container>

        <Container>
          <Tiles
            feeds={this.state.feeds}
          />
        </Container>
      </div>
    );
  }
}
