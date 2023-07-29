import { Request, Response } from 'express';
import WebhookService from '../services/WebhookService';
import {iTimerData } from '../types/types';


class WebhookController {
  private webhookService: WebhookService;

  constructor() {
    this.webhookService = new WebhookService();
  }

  public createWebhook = async(req: Request, res: Response): Promise<void> => {
    try {
      const { hours, minutes, seconds, url } = req.body;

      if (typeof hours !== 'number' || typeof minutes !== 'number' || typeof seconds !== 'number' || typeof url !== 'string') {
        res.status(400).json({ error: 'Invalid input. Please provide hours, minutes, seconds, and a valid URL.' });
      }

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      const newWebhook: iTimerData | null = await this.webhookService.createWebhook( url, totalSeconds );
      res.json({id: newWebhook?.id, timeLeft: newWebhook?.timeLeft});      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public handleOverdueWebhooks = async (): Promise<void> => {
    try {
    await this.webhookService.handleOverdueWebhooks();
  } catch (error) {
    console.error(error);
  }
  };

  public getWebhookById = async(req: Request, res: Response): Promise<void> => {
    try {
      const webhookId = parseInt(req.params.id);
      const webhook: iTimerData | null = await this.webhookService.getWebhookById(webhookId);
      if (!webhook) {
        res.status(404).json({ error: 'Webhook not found' });
        return;
      }
      const now = new Date();
      const secLeft = Math.round((webhook.createdAt.getTime() + webhook.timeLeft*1000 - now.getTime()) / 1000);
      res.json({id: webhook?.id, timeLeft: secLeft});      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // this emdpoint 
  public test = async(req: Request, res: Response): Promise<void> => {
    const webhookId = parseInt(req.params.id);
    res.json(webhookId);
    console.log('Check', webhookId);
  };
}

export default WebhookController;