const express = require('express');
const router = express.Router();

// `/select` に GET でアクセスしたときの処理
router.get('/', async (req, res) => {
    try {
        // セッションにユーザー情報があるか確認
        if (!req.session.userid) {
            return res.redirect('/login'); // 未ログインならログインページへリダイレクト
        }

        // `select.ejs` にユーザー名を渡してレンダリング
        res.render('select', { username: req.session.name });

    } catch (error) {
        console.error('エラー:', error);
        res.status(500).send('サーバーエラーが発生しました');
    }
});

module.exports = router;