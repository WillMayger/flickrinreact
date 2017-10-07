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
      clickedClass: '',
    };

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
    let filterFeeds = this.mergeArraysNoRepeat(this.state.feeds, optionalFeeds);
    if (this.state.feedsPreSearch.length > 0) {
      filterFeeds = this.mergeArraysNoRepeat(this.state.feedsPreSearch, optionalFeeds);
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

  mergeArraysNoRepeat(main, addition) {
    const mergedArray = addition.filter(item => (
      JSON.stringify(main).indexOf(item.link) === -1
    ));
    return [...main, ...mergedArray];
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
        let feeds = this.mergeArraysNoRepeat(stateFeeds, json.items);
        if (feeds.length > stateFeeds.length) {
          feeds = feeds.map((item) => {
            const feedItem = item;
            feedItem.author = feedItem.author
              .split('nobody@flickr.com')
              .join('')
              .split('("')
              .join('')
              .split('")')
              .join('');

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
