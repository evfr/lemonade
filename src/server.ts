import express from 'express';
import WebhookController from './controllers/WebhookController';
import DbService from './services/DbService';

class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    const webhookController = new WebhookController();

    this.app.post('/timers', webhookController.createWebhook);
    this.app.get('/timers/:id', webhookController.getWebhookById);

    //for my tests
    this.app.post('/test/:id', webhookController.test);
  }

  public async start(): Promise<void> {
    const webhookController = new WebhookController();
    await DbService.getDb();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
    await webhookController.handleOverdueWebhooks();
  }
}

const port = 3000;
const server = new Server(port);
server.start();
