const express = require('express');
const router = express.Router();
const pool = require('../db'); // データベース接続用のプール
const bcrypt = require('bcrypt'); // パスワードのハッシュ化と比較に使用


router.get('/', (req, res) => {
    res.render('register');  // register.ejsを表示する処理
});

// register.js
function validatePassword(password) {
  // パスワードが8文字以上で、大文字、小文字、数字を含むか確認
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // 特殊文字を含まない
  return re.test(password);
}

router.post('/register', async (req, res) => {
  try {
      const username = req.body.name;
      const password = req.body.pass;

      console.log('受け取ったパスワード:', password); // 追加: パスワードを表示
      
      // パスワード強度のバリデーション
      if (!validatePassword(password)) {
          return res.send({ msg: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります。' });
      }

      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザー名が既に存在するか確認
      const [existingUsers] = await pool.query('SELECT * FROM users WHERE name = ?', [username]);

      if (existingUsers.length > 0) {
          return res.send({ msg: 'そのユーザー名は既に使用されています。' });
      }

      // 新しいユーザーをデータベースに挿入
      const result = await pool.query('INSERT INTO users (name, pass, points) VALUES (?, ?, ?)', [username, hashedPassword, 0]);

      res.send({ msg: '登録が完了しました！ログインしてください' });
  } catch (err) {
      console.error(err);
      res.status(500).send({ msg: 'サーバーエラーが発生しました' });
  }
});


module.exports = router;
