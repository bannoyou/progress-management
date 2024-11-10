const express = require('express');
const router = express.Router();
const pool = require('../db'); // データベース接続用のプール
const bcrypt = require('bcrypt'); // パスワードのハッシュ化と比較に使用


// ログイン処理のPOSTリクエスト
router.post('/login', async (req, res) => {
    const { name, pass } = req.body;  // フォームからユーザー名とパスワードを取得

    try {
        // データベースからユーザー名でユーザーを検索
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        if (rows.length > 0) {
            const user = rows[0];  // ユーザー情報を取得

            console.log(user.id);
            console.log(user.name);
            // パスワードを比較（bcryptを使用）
            const isMatch = await bcrypt.compare(pass, user.pass);
            
            if (isMatch) {
                // パスワードが一致した場合、ユーザーを `select.ejs` ページにリダイレクト
                req.session.userid = user.id;
                req.session.name = user.name;

                console.log(user.id);
                console.log(user.name);
                res.render('select', { username: user.name });

            } else {
                // パスワードが間違っている場合、ログインページを再表示しエラーメッセージを表示
                res.render('login', { failed: true });
            }
        } else {
            // ユーザー名がデータベースに見つからない場合、エラーメッセージを表示
            res.render('login', { failed: true });
        }
    } catch (err) {
        console.error('ログイン処理中のエラー:', err);
        res.status(500).send('サーバーエラーが発生しました');
    }
});



module.exports = router;
