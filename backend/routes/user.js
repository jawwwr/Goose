import 'babel-polyfill';
import Router from 'koa-router';
import UserControllers from '../controllers/user';

const api = 'user';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// POST /api/user
router.post('/', UserControllers.create);



export default router;