const express = require('express');
const router = express.Router();
const pool = require('../db'); // データベース接続用のプール
const bcrypt = require('bcrypt'); // パスワードのハッシュ化と比較に使用

router.get('/', (req, res) => {
    res.render('register');  // register.ejsを表示する処理
});

// パスワードバリデーション
function validatePassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // 特殊文字を含まない
  return re.test(password);
}

router.post('/register', async (req, res) => {
  const connection = await pool.getConnection(); // トランザクション用の接続を取得
  try {
      await connection.beginTransaction(); // トランザクション開始

      const username = req.body.name;
      const password = req.body.pass;

      console.log('受け取ったパスワード:', password);

      // パスワード強度のバリデーション
      if (!validatePassword(password)) {
          return res.send({ msg: 'パスワードは8文字以上で、大文字、小文字、数字を含む必要があります。' });
      }

      // ユーザー名が既に存在するか確認
      const [existingUsers] = await connection.query('SELECT * FROM users WHERE name = ?', [username]);
      if (existingUsers.length > 0) {
          return res.send({ msg: 'そのユーザー名は既に使用されています。' });
      }

      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザー登録
      const [userResult] = await connection.query('INSERT INTO users (name, pass, points) VALUES (?, ?, ?)', [username, hashedPassword, 0]);
      const userId = userResult.insertId; // 挿入したユーザーのIDを取得

      // main_tasks から全ての main_task_id を取得
      const [mainTasks] = await connection.query('SELECT id FROM main_tasks');

      // 各 main_task に紐づく sub_tasks を取得し、user_tasks に登録
      for (const mainTask of mainTasks) {
          const mainTaskId = mainTask.id;

          // 該当する sub_tasks を取得
          const [subTasks] = await connection.query('SELECT id FROM sub_tasks WHERE main_task_id = ?', [mainTaskId]);

          if (subTasks.length > 0) {
              // user_tasks に一括挿入するデータを作成
              const insertValues = subTasks.map(subTask => [userId, mainTaskId, subTask.id, 0]);

              await connection.query('INSERT INTO user_tasks (user_id, main_task_id, sub_task_id, completed) VALUES ?', [insertValues]);
          }
      }

      // すべて成功したらコミット
      await connection.commit();

      res.send({ msg: '登録が完了しました！ログインしてください' });
  } catch (err) {
      await connection.rollback(); // エラー発生時はロールバック
      console.error(err);
      res.status(500).send({ msg: 'サーバーエラーが発生しました' });
  } finally {
      connection.release(); // 接続を解放
  }
});

module.exports = router;
