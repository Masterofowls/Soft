const app = require('./server');
const request = require('supertest');

global.app = app;
global.request = request(app);
