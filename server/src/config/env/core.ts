import * as path from 'path';

const rootPath = path.normalize(`${__dirname}/../../..`);

export const core = {
  root: rootPath,
  host: process.env.HOST,
  port: process.env.PORT || 80,
  secure_port: process.env.HTTPS_PORT,
  db_url: process.env.MONGOHQ_URL,
  db_config: {
    driver: 'mongodb',
    host: process.env.DB_SERVER ? process.env.DB_SERVER : 'localhost',
    port: '27017',
    dbName: 'CollaborativeIde',
    replicaHost: process.env.DB_REPLICA ? process.env.DB_REPLICA : undefined,
    replicaPort: '27017',
  },
  db: {
    driver: 'mongodb',
    host: 'localhost',
    port: '27017',
    name: 'collaborativeIde',
    replica: {
      replicaPort: '27017',
    },
  },
  db_options: {
    keepAlive: true,
    maxPoolSize: 10,
    useNewUrlParser: true,
    wtimeoutMS: 30000,
    readPreference: 'nearest',
    useUnifiedTopology: true,
  },
  TOKEN_EXPIRE_TIME_SEC: process.env.TOKEN_EXPIRE_TIME_SEC,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  MONGODB: {
    DOCUMENT_EXPIRY: 3 * 3600,
  },
};
