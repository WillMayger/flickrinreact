// as a page
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Page from './components/Page';

const FlickrPage = () => (
  <Page APIKEY={'3ad4bb148ebb914553a27ee8e4cd664a'} SECRET={'1ec880b0e9b66011'} />
);

ReactDOM.render(<FlickrPage />, document.getElementById('root'));
registerServiceWorker();

// for the component
// import Page from './components/Page';
//
// export default Page;
