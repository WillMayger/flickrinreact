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
      feedsPreSearch: [],
      clientHeight: 0,
    };

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.callApi = this.callApi.bind(this);
    this.infinateScroll = this.infinateScroll.bind(this);
  }

  componentWillMount() {
    const clientHeight = document.querySelector('body').clientHeight;
    this.setState({ clientHeight });
  }

  componentDidMount() {
    this.callApi();
    document.addEventListener('scroll', this.infinateScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.infinateScroll);
  }

  infinateScroll() {
    const tiles = document.querySelector('#wrap');
    console.log(tiles.scrollTop);
    if (tiles.scrollTop + tiles.clientHeight >= tiles.scrollHeight && this.state.query === '') {
      this.callApi();
    } else {
      console.log(tiles.scrollTop);
      console.log(tiles.clientHeight);
      console.log(tiles.scrollHeight);
    }
  }

  updateSearchQuery(e) {
    const query = e.target.value;
    if (query === '') return;
    const filterFeeds = this.state.feedsPreSearch.length > 0 ? this.state.feedsPreSearch : this.state.feeds;
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

  callApi(e) {
    if (e) e.preventDefault();
    console.log('calling api');
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
        const stateFeeds = this.state.feeds;
        const newFeeds = json.items.filter(
          item => JSON.stringify(stateFeeds).indexOf(JSON.stringify(item)) === -1,
        );
        const feeds = [...stateFeeds, ...newFeeds];
        this.setState({ feeds });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div
        style={{
          height: `${this.state.clientHeight}px`,
          overflow: 'auto',
          width: '100%',
        }}
        className="wrap"
        id="wrap"
      >
        <button onClick={e => this.callApi(e)}> add more! </button>
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
