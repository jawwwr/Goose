import 'babel-polyfill';
import Router from 'koa-router';
import RoomControllers from '../controllers/room';

const api = 'room';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// POST /api/room
router.post('/', RoomControllers.create);



export default router;