const router = require('express').Router();
const todosController = require('../controllers/todos.controller');

router.post('/', todosController.create);
router.get('/', todosController.list);
router.put('/:id', todosController.update);
router.delete('/:id', todosController.remove);

module.exports = router;