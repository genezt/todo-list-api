import express, { Express } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { serve, setup } from 'swagger-ui-express';
import { parse } from 'yaml';
import TasksApi from './tasks/api';

/** Initialize Epress server **/

const SERVER: Express = express();
const PORT = 9000;

SERVER.use(express.json());
SERVER.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  response.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
  next();
});

/** Initialize api **/

TasksApi.forEach((route: any) => {
  SERVER[route.method](route.path, route.handler);
});

/** Initialize swagger ui **/

const swaggerFile = readFileSync(resolve(__dirname, '../', 'public', 'swagger.yaml'), 'utf8');
const swaggerDocument = parse(swaggerFile);
SERVER.use('/', serve, setup(swaggerDocument));

SERVER.listen(PORT, () => {
  console.log(`⚡️[SERVER]: Server is running at http://localhost:${PORT}`);
  console.log(`⚡️[SERVER]: Rest endpoint is available: http://localhost:${PORT}/api`);
});
