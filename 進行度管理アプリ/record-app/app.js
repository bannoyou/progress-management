const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// 設定：EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQLデータベースの接続設定
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'youi0819',
  database: 'score_management'
});

// データベース接続
db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// 課題の点数を取得して表示
app.get('/scores', (req, res) => {
  const sql = 'SELECT * FROM tasks'; // データベースから課題データを取得するSQLクエリ
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('scores', { tasks: results }); // 取得したデータをEJSテンプレートに渡してレンダリング
  });
});

// 小課題をクリアした際の得点更新
app.post('/update_score/:id', (req, res) => {
  const taskId = req.params.id; // URLパラメータから課題IDを取得
  const sql = 'UPDATE tasks SET score = score + 10 WHERE id = ?'; // 指定したIDの課題の得点を更新するSQLクエリ
  db.query(sql, [taskId], (err, result) => {
    if (err) throw err;
    res.redirect('/scores'); // 更新後、課題一覧ページにリダイレクト
  });
});

//localhost3000でアクセス可能なサーバを起動する
app.listen(3000);
