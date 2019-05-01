import 'babel-polyfill';
import Router from 'koa-router';
import ChatControllers from '../controllers/chat';

const api = 'chat';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/chat
router.get('/', ChatControllers.findChatByRooms);

// GET /api/chat/room_id
router.get('/:room_id', ChatControllers.findChatByRoom);

// POST /api/chat
router.post('/', ChatControllers.create);



export default router;