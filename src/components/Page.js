import Flickr from 'flickr-sdk';
import React, { Component } from 'react';
import Container from './Containers/Container';
import Search from './Search/Search';
import Tiles from './Tiles/Tiles';

export default class FlickrPage extends Component {
  static mergeArraysNoRepeat(main, addition) {
    const mergedArray = addition.filter(item => (
      JSON.stringify(main).indexOf(item.id) === -1
    ));
    return [...main, ...mergedArray];
  }

  constructor() {
    super();
    this.state = {
      query: '',
      feeds: [],
      feedsPreSearch: [],
      clickedClass: '',
    };

    this.flickr = new Flickr('API KEY HERE');

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.callApi = this.callApi.bind(this);
    this.infinateScroll = this.infinateScroll.bind(this);
    this.toggleKeywordText = this.toggleKeywordText.bind(this);
  }

  componentWillMount() {
    this.callApi();
  }

  componentDidMount() {
    const tiles = document.querySelector('#tiles');
    tiles.addEventListener('scroll', this.infinateScroll);

    // call api every 10 seconds
    const intervalApi = () => {
      if (tiles.scrollTop + tiles.clientHeight >= (tiles.scrollHeight / 3)) {
        this.callApi(true);
      }
      setTimeout(() => { intervalApi(); }, 10000);
    };
    intervalApi();
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

  updateSearchQuery(e, optionalFeeds = []) {
    const query = typeof e === 'string' ? e : e.target.value;
    let filterFeeds = FlickrPage.mergeArraysNoRepeat(this.state.feeds, optionalFeeds);
    if (this.state.feedsPreSearch.length > 0) {
      filterFeeds = FlickrPage.mergeArraysNoRepeat(this.state.feedsPreSearch, optionalFeeds);
    }

    if (query === '') {
      this.setState({
        query,
        feeds: filterFeeds,
        feedsPreSearch: [],
      });
      return;
    }

    const feeds = filterFeeds.filter((item) => {
      if (item.title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      item.tags.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      item.ownername.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
      item.id.indexOf(query) >= 0 ||
      item.owner.indexOf(query) >= 0) {
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
    this.flickr.photos.getRecent({ extras: ['owner_name', 'tags'] })
      .then(res => res.body.photos.photo)
      .then((array) => {
        const stateFeeds = this.state.feeds;
        let feeds = FlickrPage.mergeArraysNoRepeat(stateFeeds, array);
        if (feeds.length > stateFeeds.length) {
          feeds = feeds.map((item) => {
            const feedItem = item;
            if (feedItem.title.split(' ').join('') === '') {
              feedItem.title = '"No Title Provided"';
            }
            return feedItem;
          });
          if (feeds.length > 200) feeds.splice(0, 100);
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

  toggleKeywordText(e) {
    e.preventDefault();
    this.setState({ clickedClass: 'hidden' });
  }

  render() {
    return (
      <div className="wrap" id="wrap">
        <Container>
          <Search
            onChange={this.updateSearchQuery}
            onClick={this.toggleKeywordText}
            clickedClass={this.state.clickedClass}
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
