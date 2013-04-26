Backend code for Streetmix

## Development setup (on Mac OS X 10.8)

### First-time setup

1) Download and install [Node.js](http://nodejs.org/).

2) Download, install and start [MongoDB](http://www.mongodb.org/).

3) Clone this repository to a folder on your computer. The rest of this document will refer to this folder as `$PROJECT_ROOT`.

4) Install project dependencies.

    cd $PROJECT_ROOT
    npm install

### Every time you sync $PROJECT_ROOT with the remote GitHub repo

1) Update the project dependencies.

    cd $PROJECT_ROOT
    npm install

### To start the REST API server

1) Start the REST API server.

    cd $PROJECT_ROOT
    node restapi/server.js
### Project folder structure

`$PROJECT_ROOT`: Folder to which this repository was cloned. <br />
└`config`: Folder containing configuration files for the application. <br />
└`models`: Folder containing models that let the application communicate with the data store. <br />
└`restapi`: Folder containing code for the REST API server, resources and documentation. <br />
