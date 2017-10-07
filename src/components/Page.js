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
      filter: '',
      feedsPreSearch: [],
      feedsPreFilter: [],
      feeds: [],
      clickedFilter: '',
      clickedSearch: '',
    };

    this.flickr = new Flickr('3ad4bb148ebb914553a27ee8e4cd664a');

    this.updateFilter = this.updateFilter.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.callApi = this.callApi.bind(this);
    this.infinateScroll = this.infinateScroll.bind(this);
    this.toggleKeywordSearch = this.toggleKeywordSearch.bind(this);
    this.toggleKeywordFilter = this.toggleKeywordFilter.bind(this);
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

  updateSearch(e) {
    this.setState({ clickedSearch: 'hidden' });
    const query = typeof e === 'string' ? e : e.target.value;
    const searchFeeds = this.state.feedsPreSearch.length > 0 ?
      this.state.feedsPreSearch : [];

    if (query === '') {
      this.setState({
        query,
        feeds: searchFeeds,
        feedsPreSearch: [],
        clickedSearch: '',
      });
      if (typeof e !== 'string') {
        document.activeElement.blur();
      }
      this.callApi();
      return;
    }

    this.flickr.photos.search({
      text: query,
      extras: ['owner_name', 'tags'],
      per_page: this.state.feedsPreSearch.length + 100,
    })
      .then(res => res.body.photos.photo)
      .then((array) => {
        const newSearchFeeds = FlickrPage.mergeArraysNoRepeat(searchFeeds, array);
        this.setState({
          query,
          feeds: newSearchFeeds,
          feedsPreSearch: searchFeeds.length > 0 ? searchFeeds : newSearchFeeds,
        });
        if (this.state.filter !== '') {
          this.updateFilter(this.state.filter, newSearchFeeds);
        }
      });
  }

  updateFilter(e, optionalFeeds = []) {
    this.setState({ clickedFilter: 'hidden' });
    const filter = typeof e === 'string' ? e : e.target.value;
    let filterFeeds = FlickrPage.mergeArraysNoRepeat(this.state.feeds, optionalFeeds);
    if (this.state.feedsPreFilter.length > 0) {
      filterFeeds = FlickrPage.mergeArraysNoRepeat(this.state.feedsPreFilter, optionalFeeds);
    }

    if (filter === '') {
      this.setState({
        filter,
        feeds: filterFeeds,
        feedsPreFilter: [],
        clickedFilter: '',
      });
      if (typeof e !== 'string') {
        document.activeElement.blur();
      }
      return;
    }

    const feeds = filterFeeds.filter((item) => {
      if (item.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
      item.tags.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
      item.ownername.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
      item.id.indexOf(filter) >= 0 ||
      item.owner.indexOf(filter) >= 0) {
        return true;
      }
      return false;
    });

    this.setState({
      filter,
      feeds,
      feedsPreFilter: filterFeeds,
    });
  }

  callApi(rerun = false) {
    if (this.state.query !== '') return this.updateSearch(this.state.query, this.state.feeds.length + 100);
    return this.flickr.photos.getRecent({ extras: ['owner_name', 'tags'] })
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
          if (this.state.filter !== '') {
            this.updateSearchQuery(this.state.filter, feeds);
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

  toggleKeywordFilter(e) {
    e.preventDefault();
    this.setState({ clickedFilter: 'hidden' });
  }

  toggleKeywordSearch(e) {
    e.preventDefault();
    this.setState({ clickedSearch: 'hidden' });
  }

  render() {
    return (
      <div className="wrap" id="wrap">
        <Container>
          <div className="search">
            <Search
              onChange={this.updateSearch}
              onClick={this.toggleKeywordSearch}
              clickedClass={this.state.clickedSearch}
              query={this.state.query}
              type={'Search'}
            />

            <Search
              onChange={this.updateFilter}
              onClick={this.toggleKeywordFilter}
              clickedClass={this.state.clickedFilter}
              query={this.state.filter}
              type={'Filter'}
            />
          </div>
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
