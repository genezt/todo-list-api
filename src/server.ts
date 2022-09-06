import express, { Express } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { serve, setup } from 'swagger-ui-express';
import { parse } from 'yaml';
import TasksApi from './tasks/api';
import { TasksActionsService } from './data/tasks.actions.service';

/** Initialize Epress server **/

const SERVER: Express = express();
const PORT = Number(process.env.PORT) || 9000;
export const tasksActionsService = new TasksActionsService();

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

TasksApi.forEach(async (route: any) => {
  SERVER[route.method](route.path, route.handler);
});

/** Initialize swagger ui **/

const swaggerFile = readFileSync(resolve(__dirname, '../', 'public', 'swagger.yaml'), 'utf8');
const swaggerDocument = parse(swaggerFile);
SERVER.use('/', serve, setup(swaggerDocument));

SERVER.listen(PORT, '0.0.0.0', async () => {
  await tasksActionsService.init();
  console.log(`⚡️[SERVER]: Server is running at http://localhost:${PORT}`);
  console.log(`⚡️[SERVER]: Rest endpoint is available: http://localhost:${PORT}/api`);
});
