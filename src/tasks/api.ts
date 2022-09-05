import { Request, Response } from 'express';
import { TasksActionsService } from '../data/tasks.actions.service';
const tasksActionsService = new TasksActionsService();

const findAllTask = async (request: Request, response: Response) => {
  try {
    await tasksActionsService.init();
    // make sure that any items are correctly URL encoded in the connection string
    const results = await tasksActionsService.findTasks();
    return response.status(200).send(results);
  } catch (err) {
    // ... error checks
    console.log(err);
    return response.status(500).send({ status: 500, message: 'Server' });
  }
};

const findTaskById = async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await tasksActionsService.init();
    // make sure that any items are correctly URL encoded in the connection string
    const task = await tasksActionsService.findTask(id);
    return response.status(200).send(task);
  } catch ({ message }) {
    return response.status(500).send({ status: 404, message });
  }
};

const updateTaskById = async (request: Request, response: Response) => {
  const id: string = request.params.id;
  const body = request.body;
  try {
    await tasksActionsService.init();
    const result = await tasksActionsService.updateTask(id, body);
    return response.status(201).send({ status: 200, message: result });
  } catch ({ message }) {
    return response.status(500).send({ status: 404, message });
  }
};

const createTask = async (request: Request, response: Response) => {
  const body = request.body;
  await tasksActionsService.init();
  const result = await tasksActionsService.addTask(body);
  return response.status(201).send(result);
};

const deleteTask = async (request: Request, response: Response) => {
  const id: string = request.params.id;
  await tasksActionsService.init();
  const result = await tasksActionsService.removeTask(id);
  return response.status(201).send(result);
};

export default [
  {
    method: 'get',
    path: '/api/tasks',
    handler: findAllTask,
  },
  {
    method: 'post',
    path: '/api/tasks',
    handler: createTask,
  },
  {
    method: 'get',
    path: '/api/tasks/:id',
    handler: findTaskById,
  },
  {
    method: 'patch',
    path: '/api/tasks/:id',
    handler: updateTaskById,
  },
  {
    method: 'delete',
    path: '/api/tasks/:id',
    handler: deleteTask,
  },
];
