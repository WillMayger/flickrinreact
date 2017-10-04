import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/Page';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Page />, document.getElementById('root'));
registerServiceWorker();
