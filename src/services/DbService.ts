import { MongoClient, Db, Collection  } from 'mongodb';

class DbService {
    private static connection: Promise<MongoClient>;
    private uri = 'mongodb+srv://evfisher:evfisher@cluster-2023.wpjvtmg.mongodb.net/1st?retryWrites=true&w=majority';
  
    public static async getConnection(): Promise<MongoClient> {
      if (DbService.connection) {
        return DbService.connection;
      }
  
      const dbService = new DbService();
      DbService.connection = dbService.connect();
      return DbService.connection;
    }

    public static async getDb(): Promise<Db> {
      const connection = await DbService.getConnection();
      const db:Db = connection.db('1st');
      return db;
    }

    private async connect(): Promise<MongoClient> {
      const dbClient = new MongoClient(this.uri);
      await dbClient.connect();
      return dbClient;
    }
  }

  export default DbService;