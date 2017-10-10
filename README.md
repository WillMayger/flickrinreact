# flickrinreact
Using the Flickr API with React.js

## working version at http://willmayger.uk/flickr

###  To use:
  - clone this repository,
  - run npm install.
  - Change the homepage url in package.json to your homepage.
  - Add in your Flickr API key in index.js or replace the string with a system variable.
  - then run `gulp` for development. (or `npm run startdev`).

### To deploy:
 - Run `npm run build`
 - Then push to your server and check it out!

### To Do:
- Add logo / wording as a top bar at desktop.
- load images per users viewport instead of all images from the API at once to improve speed.
- Write code to do what the package `react-typist` is doing instead of importing it to reduce code base and fix issue with IE.

  ### Made by Will Mayger | http://willmayger.uk | will.mayger@theweblancer.com
