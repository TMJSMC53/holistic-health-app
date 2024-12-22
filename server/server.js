//e.g server.js
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import ViteExpress from 'vite-express';

import 'dotenv/config';
import connect from './db/conn.js';

import router from './routes/router.js';

import quoteRoutes from './routes/router.js';
const PORT = process.env.PORT || 5151;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static('dist'));
}
app.use((req, res, next) =>
  connect()
    .then((connection) => {
      // Disconnect from the DB after the response is sent/aborted
      const cleanup = async () => {
        try {
          await connection.disconnect();
        } catch (error) {
          console.error('Error closing database connection:', error);
        }
      };

      // res.on('finish', cleanup); // On response sent
      // res.on('close', cleanup); // On request abort
      return next();
    })
    .catch(next)
);
// routes
app.use('/', router);
if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.use('/api', quoteRoutes);

if (process.env.NODE_ENV === 'development') {
  ViteExpress.listen(app, PORT, () =>
    console.log(`Server is listening on PORT ${PORT} `)
  );
}

export default app;
