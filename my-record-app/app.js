const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login'); 
const recordRoutes = require('./routes/record');
const registerRoutes = require('./routes/register');
const historyRoutes = require('./routes/history');
const selectRoutes = require('./routes/select'); 
const db = require('./db');  // db.js を読み込む

console.log('loginRoutes:', loginRoutes);
console.log('recordRoutes:', recordRoutes);
console.log('registerRoutes:', registerRoutes);
console.log('historyRoutes:', historyRoutes);
console.log('selectRoutes:', selectRoutes);
console.log('db',db);

const app = express();

//セッション管理
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({}, db);  // db.js の pool を使用

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false }, // secure: false を設定
  store: sessionStore,
  resave: false,
  saveUninitialized: false,  // 未初期化のセッションを保存しない
};


// ここから未変更
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

// 共通データをセットするミドルウェア
app.use((req, res, next) => {
  res.locals.user_name = req.session.name || "Guest"; // セッションからユーザー名を取得
  next();  // 次のミドルウェアまたはルートハンドラーへ
});

//閲覧数を記録
app.get('/', (req, res,next) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  const view = req.session.views
  console.log(view);
  next();
})


// ルート設定
app.get('/', (req, res) => {
    res.render('login'); // 'select.ejs' を views フォルダに配置
  });

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');

// body-parser設定
app.use(bodyParser.urlencoded({ extended: false }));

//パスの設定
const path=require('path');

//非同期処理リクエストbody
app.use(express.json()); 

// 静的ファイルの提供（必要に応じて設定）
app.use(express.static(path.join(__dirname, 'public')));

// ルートを設定
app.use('/', loginRoutes);
app.use('/register', registerRoutes);
app.use('/record', recordRoutes);
app.use('/history',historyRoutes);
app.use('/select', selectRoutes);


// サーバーをポート3000で起動
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
