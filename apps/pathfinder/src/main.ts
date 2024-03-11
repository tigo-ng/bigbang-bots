/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import _ from 'lodash';

import ParseDashboard from 'parse-dashboard';
import * as Parse from 'parse-server';

import project from '../project.json';

const port = process.env.PORT || 3333;

const configs = {
  apps: {
    [project.name]: {
      appId: '45bd4614-541b-4cfa-921c-8cceeef8057c',
      appName: project.name,
      masterKey: 'iiGhXFm1N46uJlcD3Z/Q9yfBmIUFqxEdjJnTt+6cozg=',
      cloud: path.join(__dirname, './cloud/index'),
      databaseURI: `mongodb://localhost:27017/dev`,
      serverURL: `http://localhost:${port}/parse-api`,
      graphQLServerURL: `http://localhost:${port}/parse-api/graphql`,
    },
  },
};

const app = express();

const parseDashboard = new ParseDashboard({ apps: _.values(configs.apps) });
const parseServer = new Parse.ParseServer(configs.apps[project.name]);

parseServer.start();

app.use('/parse-dashboard', parseDashboard);
app.use('/parse-api', parseServer.app);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to pathfinder!' });
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
