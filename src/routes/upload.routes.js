const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/handleUpload');
const {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
} = require('../controller/upload');

router.post("/", uploadMiddleware.single("avatar"), createItem);

router.get("/", getItems);

router.get("/:id", getItem);

router.put("/:id", updateItem);

router.delete("/:id", deleteItem);

module.exports = router;
