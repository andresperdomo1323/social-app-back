const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, loginUser, updateUser, deleteUser } = require('../controller/UserController');

router.route('/').get(getUser).post(createUser);
router.route('/getUsers').get(getUsers);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

router.route('/login').post(loginUser);

module.exports = router;