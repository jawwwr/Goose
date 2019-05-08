import 'babel-polyfill';
import Router from 'koa-router';
import UserControllers from '../controllers/user';

const api = 'user';
const baseApi = process.env.BASE_API
const router = new Router();

router.prefix(`/${baseApi}/${api}`);

router.post('/', UserControllers.create);

router.get('/', UserControllers.find);

router.get('/:id', UserControllers.findOne);

router.put('/:id', UserControllers.update);
router.put('/socket/:id', UserControllers.updateSocket);

export default router;