# This directory contains the api server portion of the project.

The server is written using javascript, specifically NodeJS and ExpressJS.

It interfaces with the SQLite database file, located in the [demo-scraper](../demo-scraper) directory.


## Installation

Open up your shell of choice and navigate into the server directory.
Run `npm install`. This will install all of the required dependencies as specified in package.json.

The server can be started with `node index.js`.

ExpressJS is the framework I use for setting up the api endpoints.
The file index.js sets up the routes and starts the server.
The file dbService.js contains functions for interfacing with the SQLite database.

For development purposes, I use `nodemon` to automatically watch for file changes and restart the server. Normally, you would have to do this manually.
