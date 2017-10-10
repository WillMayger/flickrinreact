// Custom Flickr API Client
export default class Flickr {
  // format data into valid get requests.
  static formatGet(options) {
    let query = '';
    if (options.query) {
      query = `&text=${options.query.split(' ').join('+')}`;
    }

    return `https://api.flickr.com/services/rest/?method=${options.method}&format=json&nojsoncallback=1&api_key=${options.key}&extras=tags,owner_name&page=${options.page}&per_page=${options.per_page}${query}`;
  }

  constructor(key) {
    if (!key) return console.log('No API Key provided');
    this.KEY = key;
  }

  // Using the 'flickr.photos.getRecent' api endpoint to get public recent photos
  getRecentPhotos(page = 1, perpage = 100) {
    return new Promise((resolve, reject) => {
      const options = {
        page,
        method: 'flickr.photos.getRecent',
        key: this.KEY,
        per_page: perpage,
      };

      // get data and resolve array if no errs
      fetch(Flickr.formatGet(options))
        .then(res => res.json())
        .then(res => resolve(res.photos.photo))
        .catch(err => reject(err));
    });
  }

  // Using the 'flickr.photos.search' api endpoint to get public photos by search query
  getPhotosByQuery(query, page = 1, perpage = 100) {
    return new Promise((resolve, reject) => {
      if (!query) reject('no search query provided to api call to search');
      const options = {
        page,
        query,
        method: 'flickr.photos.search',
        key: this.KEY,
        per_page: perpage,
      };

      // get data and resolve array if no errs
      fetch(Flickr.formatGet(options))
        .then(res => res.json())
        .then(res => resolve(res.photos.photo))
        .catch(err => reject(err));
    });
  }
}
