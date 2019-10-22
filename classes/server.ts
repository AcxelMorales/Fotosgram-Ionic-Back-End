import express from 'express';

/**
 * Server class of Express Server
 */
export default class Server {

  public app : express.Application;
  public port: number = 3000;

  constructor() {
    this.app = express();
  }

  start(callback: any): void {
    this.app.listen(this.port, callback);
  }

}