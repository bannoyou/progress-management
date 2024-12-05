const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL接続用プール

router.get('/', (req, res) => {
    res.render('select');  // register.ejsを表示する処理
});

module.exports = router;