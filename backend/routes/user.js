import 'babel-polyfill';
import Router from 'koa-router';
import UserControllers from '../controllers/user';

const api = 'user';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// POST /api/user
router.post('/', UserControllers.create);

// GET /api/user
router.get('/', UserControllers.find);

router.get('/:id', UserControllers.findOne);

export default router;