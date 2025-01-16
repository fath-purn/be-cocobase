const {createAdmin, authenticate, loginAdmin} = require('../controllers/admin.controller');
const router = require('express').Router();
const verifyToken = require('../libs/verifyToken');

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.get('/whoami', verifyToken, authenticate);

module.exports = router;