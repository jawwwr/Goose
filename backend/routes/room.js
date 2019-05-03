import 'babel-polyfill';
import Router from 'koa-router';
import RoomControllers from '../controllers/room';

const api = 'room';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/room
router.get('/', RoomControllers.find);

// GET /api/room/:id
router.get('/:id', RoomControllers.findOne);

// POST /api/room
router.post('/', RoomControllers.create);

// PUT /api/room/:id
router.put('/:id', RoomControllers.update);



export default router;