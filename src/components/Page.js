import React, { Component } from 'react';
import Container from './Containers/Container';
import Search from './Search/Search';
import Tiles from './Tiles/Tiles';

export default class FlickrPage extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      feeds: [],
      feedsPreSearch: [],
    };

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.callApi = this.callApi.bind(this);
    this.infinateScroll = this.infinateScroll.bind(this);
  }

  componentWillMount() {
    this.callApi();
  }

  componentDidMount() {
    const tiles = document.querySelector('#tiles');
    tiles.addEventListener('scroll', this.infinateScroll);
  }

  componentWillUnmount() {
    const tiles = document.querySelector('#tiles');
    tiles.removeEventListener('scroll', this.infinateScroll);
  }

  infinateScroll() {
    const tiles = document.querySelector('#tiles');
    if (tiles.scrollTop + tiles.clientHeight >= tiles.scrollHeight) {
      this.callApi(true);
    }
  }

  updateSearchQuery(e, optionalFeeds = false) {
    const query = typeof e === 'string' ? e : e.target.value;
    let filterFeeds = this.state.feedsPreSearch.length > 0 ?
      this.state.feedsPreSearch : this.state.feeds;
    if (optionalFeeds) filterFeeds = optionalFeeds;
    if (query === '') {
      this.setState({
        query,
        feeds: filterFeeds,
        feedsPreSearch: [],
      });
      return;
    }

    const feeds = filterFeeds.filter((item) => {
      if (item.title.indexOf(query) >= 0 ||
      item.tags.indexOf(query) >= 0 ||
      item.description.indexOf(query) >= 0 ||
      item.author.indexOf(query) >= 0) {
        return true;
      }
      return false;
    });

    this.setState({
      query,
      feeds,
      feedsPreSearch: filterFeeds,
    });
  }

  callApi(rerun = false) {
    return fetch(
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
        const stateFeeds = this.state.feeds;
        const newFeeds = json.items.filter(item => (
          JSON.stringify(stateFeeds).indexOf(item.link) === -1
        ));
        if (newFeeds.length > 0) {
          const feeds = [...stateFeeds, ...newFeeds];
          if (this.state.query !== '') {
            this.updateSearchQuery(this.state.query, feeds);
          } else {
            this.setState({ feeds });
          }
        }
      })
      .then(() => {
        if (rerun) {
          const tiles = document.querySelector('#tiles');
          if (tiles.scrollTop + tiles.clientHeight >= (tiles.scrollHeight - 1000)) {
            const reCall = this.callApi.bind(this);
            reCall(true);
          }
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    // call api every 10 seconds
    const intervalApi = (() => {
      const tiles = document.querySelector('#tiles');
      if (tiles != null) {
        if (tiles.scrollTop + tiles.clientHeight >= (tiles.scrollHeight / 3)) {
          this.callApi(true);
        }
      }
      setInterval(intervalApi, 500);
    })();

    return (
      <div className="wrap" id="wrap">
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
