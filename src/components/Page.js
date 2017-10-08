import Flickr from 'flickr-sdk';
import Typist from 'react-typist';
import React, { Component } from 'react';
import Container from './Containers/Container';
import Search from './Search/Search';
import Tiles from './Tiles/Tiles';

export default class FlickrPage extends Component {
  // takes two arrays and returns a merged array with no duplicates
  static mergeArraysNoRepeat(main, addition) {
    // make immutable...
    const first = [...main];
    const second = [...addition];

    // filter out duplicates
    const newArray = second.filter(item => (
      JSON.stringify(first).indexOf(item.id) === -1
    ));

    // merge the main / first array provided with the removed duplicates array
    return first.concat(newArray);
  }

  constructor() {
    super();
    this.state = {
      query: '',
      filter: '',
      searchHistory: [],
      feedsHistory: [],
      feeds: [],
      clickedFilter: '',
      clickedSearch: '',
      lengthOfHistory: 0,
    };

    this.flickr = new Flickr('Your Api Key Here');

    // class method bindings
    this.updateFilter = this.updateFilter.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.callApi = this.callApi.bind(this);
    this.callApiSearch = this.callApiSearch.bind(this);
    this.infinateScroll = this.infinateScroll.bind(this);
    this.toggleKeywordSearch = this.toggleKeywordSearch.bind(this);
    this.toggleKeywordFilter = this.toggleKeywordFilter.bind(this);
    this.searchFocusOut = this.searchFocusOut.bind(this);
    this.filterFocusOut = this.filterFocusOut.bind(this);
    this.searchType = this.searchType.bind(this);
    this.filterType = this.filterType.bind(this);
  }

  componentWillMount() {
    // call the api on initial load
    this.callApi();
  }

  componentDidMount() {
    // when rendered add a scroll event listner for infinate scrolling
    const tiles = document.querySelector('#tiles');
    tiles.addEventListener('scroll', this.infinateScroll);
  }

  componentWillUnmount() {
    // remove event listner when page is about to end
    const tiles = document.querySelector('#tiles');
    tiles.removeEventListener('scroll', this.infinateScroll);
  }

  // infinate scroll: check if user is at the bottom and then load more if so
  infinateScroll() {
    const tiles = document.querySelector('#tiles');
    // check if user is at the bottom
    if (tiles.scrollTop + tiles.clientHeight >= tiles.scrollHeight) {
      // load more content via users search if they are using the search
      if (this.state.query !== '') {
        this.updateSearch();
        return;
      }
      // recursive function when passed with the bool true.
      this.callApi(true);
    }
  }

  // api call with search query
  callApiSearch(query, sFeeds) {
    // make immutable...
    const searchFeeds = [...sFeeds];
    const originalfeeds = sFeeds;

    // prevent page from getting slow.
    if (searchFeeds.length > 200) searchFeeds.splice(0, 100);

    // make api call with search query
    this.flickr.photos.search({
      text: query,
      extras: ['owner_name', 'tags'],
      // load 100 more each time user reaches the end
      per_page: (this.state.lengthOfHistory * 100) + 100,
      // go to second page in api if the max photo per page has been reached
      page: this.state.lengthOfHistory >= 4 ?
        1 + this.state.lengthOfHistory : 1,
    })
      .then(res => res.body.photos.photo)
      .then((array) => {
        let newSearchFeeds = [];

        // if the search was the same add to the old, if not start fresh
        if (query === this.state.query) {
          newSearchFeeds = FlickrPage.mergeArraysNoRepeat(searchFeeds, array);
          const lengthOfHistory = Math.ceil(originalfeeds.length / 100);
          const newSearchHistory = FlickrPage.mergeArraysNoRepeat(newSearchFeeds, originalfeeds);
          // prevent page from getting slow.
          if (lengthOfHistory.length > 2) newSearchHistory.splice(0, 100);
          // save to state
          this.setState({
            lengthOfHistory,
            feeds: newSearchFeeds,
            searchHistory: newSearchHistory,
          });
        } else {
          // save fresh results to state
          newSearchFeeds = FlickrPage.mergeArraysNoRepeat(array, searchFeeds);
          this.setState({
            lengthOfHistory: 0,
            feeds: newSearchFeeds,
            searchHistory: [],
          });
        }
        // if the filter is currently in use, filter new search results
        if (this.state.filter !== '') {
          this.updateFilter(this.state.filter, newSearchFeeds);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('');
        console.log('Have you entered your API key correctly?');
      });
  }

  // calling the api to get the most recent photos by everyone
  // rerun = true to make recursive
  // iteration & pageC for use by recursive mode
  callApi(rerun = false, iteration = 0, pageC = 1) {
    // if the filter or search is being used prevent api call
    if (this.state.filter !== '' || this.state.query !== '') return;
    let count = iteration;
    let pageCount = pageC;

    // call api
    this.flickr.photos.getRecent({
      extras: ['owner_name', 'tags'],
      // add 100 results everytime function is called recursively 
      per_page: (count * 100) + 100,
      // the page value (default 1) adds an aditional for every 500 results
      page: pageCount,
    })
      .then(res => res.body.photos.photo)
      .then((array) => {
        const stateFeeds = this.state.feeds;
        let feeds = FlickrPage.mergeArraysNoRepeat(stateFeeds, array);
        // check to see if there are any new results
        if (feeds.length > stateFeeds.length) {
          // if the feed item does not have a title add some placeholder text
          feeds = feeds.map((item) => {
            const feedItem = item;
            if (feedItem.title.split(' ').join('') === '') {
              feedItem.title = '"No Title Provided"';
            }
            return feedItem;
          });

          // prevent page from getting slow.
          if (feeds.length > 200) feeds.splice(0, 100);
          this.setState({ feeds });
        }
      })
      .then(() => {
        // if recursive mode is on...
        if (rerun) {
          const tiles = document.querySelector('#tiles');
          // check that the user has scrolled enough to regester for another call
          if (tiles.scrollTop + tiles.clientHeight >= (tiles.scrollHeight - 1000)) {
            // if this has ran 4 times or more set count to 0 and add a page 
            if (count >= 4) {
              pageCount += 1;
              count = 0;
            }
            this.callApi(true, count + 1, pageCount);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('');
        console.log('Have you entered your API key correctly?');
      });
  }

  // filter the current results on the page by key word
  filterResults(filter, optionalFeeds) {
    // check if feeds needs saving to history.
    if (this.state.feedsHistory.length === 0) {
      this.setState({ feedsHistory: [...this.state.feeds] });
    }
    // if the filter is now empty reset the feeds.
    if (filter === '') {
      const feedsHistory = [...this.state.feedsHistory];
      if (feedsHistory.length < 100) this.callApi();
      this.setState({
        filter: '',
        feeds: feedsHistory,
        feedsHistory: [],
      });

      return;
    }

    let filterFeeds = this.state.feedsHistory;
    // if there are extra feeds add them, otherwise use the state history and current feed.
    if (optionalFeeds.length > 0) {
      filterFeeds = FlickrPage.mergeArraysNoRepeat(filterFeeds, optionalFeeds);
    } else {
      filterFeeds = FlickrPage.mergeArraysNoRepeat(filterFeeds, this.state.feeds);
    }

    // filter array by checking for a match of title, tags, ownername, id or owner id
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
    });
  }

  // update state with search input
  updateSearch(e) {
    // if function is used by another method 
    const query = e === undefined ? this.state.query : e.target.value;

    // if user just entered spaces cancel
    if (query !== '' && query.split(' ').join('') === '') return;
    // decide whether to start fresh or start with history
    const searchFeeds = this.state.searchHistory.length > 0 &&
    query === this.state.query ?
      this.state.searchHistory : [];

    // if search is empty reset
    if (query === '') {
      this.setState({
        query,
        feeds: searchFeeds,
        feedsPreSearch: [],
      });

      this.callApi();
      return;
    }

    this.setState({
      query,
      clickedSearch: 'hidden',
    });

    // call api with search and feeds
    this.callApiSearch(query, searchFeeds);
  }

  updateFilter(e, optionalFeeds = []) {
    // if function is used by another method 
    const filter = typeof e === 'string' ? e : e.target.value;

    // if user just entered spaces cancel
    if (filter !== '' && filter.split(' ').join('') === '') return;

    this.setState({
      filter,
      clickedFilter: 'hidden',
    });
    // call filter with filter and extra feeds if provided
    this.filterResults(filter, optionalFeeds);
  }

  // update state with class of filter placeholder
  toggleKeywordFilter(e) {
    e.preventDefault();
    this.setState({ clickedFilter: 'hidden' });
  }

  // update state with class of search placeholder
  toggleKeywordSearch(e) {
    e.preventDefault();
    this.setState({ clickedSearch: 'hidden' });
  }

  // update state with class of search placeholder if user focus is off
  searchFocusOut(e) {
    e.preventDefault();
    if (this.state.query === '') {
      this.setState({ clickedSearch: '' });
    }
  }

  // update state with class of filter placeholder if user focus is off
  filterFocusOut(e) {
    e.preventDefault();
    if (this.state.filter === '') {
      this.setState({ clickedFilter: '' });
    }
  }

  // if the class type is not hidden return the search placeholder
  searchType() {
    if (this.state.clickedSearch === 'hidden') return '';

    return (
      <Typist
        stdTypingDelay={15}
        avgTypingDelay={50}
        startDelay={500}
      >
      Keyword Search...
      </Typist>
    );
  }

  // if the class type is not hidden return the filter placeholder
  filterType() {
    if (this.state.clickedFilter === 'hidden') return '';

    return (
      <Typist
        stdTypingDelay={15}
        avgTypingDelay={50}
        startDelay={500}
      >
      Filter results by keyword...
      </Typist>
    );
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
              onBlur={this.searchFocusOut}
              query={this.state.query}
              type={this.searchType}
            />

            <Search
              onChange={this.updateFilter}
              onClick={this.toggleKeywordFilter}
              clickedClass={this.state.clickedFilter}
              onBlur={this.filterFocusOut}
              query={this.state.filter}
              type={this.filterType}
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
