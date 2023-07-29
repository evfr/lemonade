import {iTimerData } from '../types/types';
import DbService from './DbService';
import { Db, WithId, Document } from 'mongodb';
import axios from 'axios';

class WebhookService {
    private db: Db | undefined;
    private tasks = new Map();

    public async handleOverdueWebhooks(): Promise<void> {
      this.db = await DbService.getDb();
      const lateWebhooks = this.db.collection("webhooks").aggregate([
        {
          $addFields: {
            "newDateField": {
              $add: ["$createdAt", { $multiply: ["$timeLeft", 1000] }]
            }
          }
        },
        {
          $match: {
            $expr: {
              $lt: ["$newDateField", new Date()]
            }
          }
        }
      ]).toArray();

      for await (const wh of await lateWebhooks) {
        this.fireWebhookAndDeleteTimer(wh.id, wh.url);
      }
      console.log(`Handled ${(await lateWebhooks).length} late Webhooks`);
    }
  
    public async getWebhookById(id: number): Promise<iTimerData | null> {
      this.db = await DbService.getDb();
      const dbWebhook: WithId<Document> | null = await this.db.collection("webhooks").findOne({id: id }) as WithId<Document>;
      if (dbWebhook) {
        const webhook: iTimerData = {
          id: dbWebhook.id,
          url: dbWebhook.url,
          timeLeft: dbWebhook.timeLeft,
          createdAt: dbWebhook.createdAt
        }
        return webhook;
      }
      return null;
    }
  
    public async createWebhook(url: string, totalSeconds: number): Promise<iTimerData | null> {
      const random: number = Math.floor(Math.random() * 10000) + 1;
      this.db = await DbService.getDb();

      const newWebhook: iTimerData = { id: random, url, timeLeft: totalSeconds, createdAt: new Date() };
      await this.db.collection("webhooks").insertOne(newWebhook);

      const myTimer = setTimeout(()=>this.fireWebhookAndDeleteTimer(newWebhook.id, newWebhook.url), totalSeconds*1000);
      this.tasks.set(newWebhook.id, myTimer);

      return newWebhook;
    }

    private async fireWebhookAndDeleteTimer(id: number, url: string) {
      try {
        this.db = await DbService.getDb();
        const currUrl = url.endsWith('/') ? `${url}${id}` : `${url}/${id}`
        await axios.post(currUrl, {});
        console.log(`Webhook ${id} fired`);
        await this.db.collection('webhooks').deleteOne({ id });
        console.log(`Webhook ${id} deleted from DB`);
        if (this.tasks.get(id)) clearTimeout(this.tasks.get(id));
        console.log(`Task ${id} deleted`);
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  export default WebhookService;