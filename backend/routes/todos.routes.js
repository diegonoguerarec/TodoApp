const router = require('express').Router();
const todosController = require('../controllers/todos.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, todosController.create);
router.get('/', authMiddleware, todosController.list);
router.get('/:id', authMiddleware, todosController.getById);
router.put('/:id', authMiddleware, todosController.update);
router.delete('/:id', authMiddleware, todosController.remove);

module.exports = router;