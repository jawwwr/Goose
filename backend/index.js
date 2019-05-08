import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import serve from 'koa-static';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import mongoose from 'mongoose';
import http from 'http'
import socketIO from 'socket.io'
import { conneXionListener } from './middlewares/socket'
import routing from './routes';

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socketIO(server, {
  transports: ['websocket'],
  pingTimeout: 30000
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);

io.on('connect', (socket) => conneXionListener(io, socket))

routing(app);

app
  .use(logger('dev'))
  .use(cors())
  .use(bodyParser())
  .use(helmet())
  .use(respond())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve('./build'));



// Start the application
server.listen(process.env.PORT, () =>
  console.log(`✅  The server is running at ${process.env.HOST}:${process.env.PORT}/`)
)

export default app;
