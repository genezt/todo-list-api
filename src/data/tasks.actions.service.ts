/**
 * A simple uuid generator
 *
 * source: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
 */
import { Task } from '../types/tasks';
import dotenv from 'dotenv';

// read in the .env file
dotenv.config();
const sql = require('mssql');

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

export class TasksActionsService {
  pool;

  constructor() {}

  async init() {
    await sql.connect(sqlConfig);
    this.pool = await sql.connect(sqlConfig);
  }

  /**
   * @description
   *  - retrieve all tasks
   */
  findTasks = async (): Promise<Array<Task>> => {
    const result = await sql.query`select * from [TodoAppDatabase].[dbo].[Tasks]`;
    return result && result.recordset && result.recordset.length > 0 ? result.recordset : [];
  };

  /**
   * @description
   *  - retrive one task by id
   */
  findTask = async (id: string): Promise<Task> => {
    const result = await this.pool
      .request()
      .input('id', sql.Int, id)
      .query('select * from [TodoAppDatabase].[dbo].[Tasks] where taskId = @id');
    return result && result.recordset && result.recordset.length > 0 && result.recordset[0];
  };

  /**
   * @description
   *  - update one task
   */
  updateTask = async (id: string, body: Partial<Task>): Promise<boolean> => {
    const result = await this.pool
      .request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(50), body.title)
      .query('UPDATE [dbo].[Tasks] SET [title] = @title WHERE taskId = @id');
    return result.rowsAffected && result.rowsAffected.length === 1;
  };

  /**
   *
   * @description
   *  - create task
   */
  addTask = async (body: Partial<Task>): Promise<boolean> => {
    const result = await this.pool
      .request()
      .input('title', sql.VarChar(50), body.title)
      .input('description', sql.VarChar(50), body.description)
      .query('INSERT INTO [dbo].[Tasks] (title, description) values (@title, @description)');
    return result.rowsAffected && result.rowsAffected.length === 1;
  };

  removeTask = async (id: string): Promise<boolean> => {
    const result = await this.pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM [TodoAppDatabase].[dbo].[Tasks] where taskId = @id');
    return result.rowsAffected && result.rowsAffected.length === 1;
  };
}
