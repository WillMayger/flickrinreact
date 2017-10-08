// as a page
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Page from './components/Page';

const FlickrPage = () => (
  <Page APIKEY={'Api Key Goes Here'} />
);

ReactDOM.render(<FlickrPage />, document.getElementById('root'));
registerServiceWorker();

// for the component
// import Page from './components/Page';
// 
// export default Page;
