const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login'); // login.js へのパスを追加
const recordRoutes = require('./routes/record');
const registerRoutes = require('./routes/register');
const historyRoutes = require('./routes/history');

const app = express();

//セッション管理
const MySQLStore = require('express-mysql-session')(session);

const options = {
  host: 'localhost', // MySQLホスト名
  user: 'root', // MySQLユーザー名
  password: 'Youi0819@', // MySQLのパスワード
  database: 'progress', // 使用するデータベース名
};

const sessionStore = new MySQLStore(options);

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  store: new MySQLStore(options),
  resave: false,
  saveUninitialized: true,
}

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


// 静的ファイルの提供（必要に応じて設定）
app.use(express.static(path.join(__dirname, 'public')));

// ルートを設定
app.use('/register', registerRoutes);
app.use('/record', recordRoutes);
app.use('/history',historyRoutes);

app.use('/', loginRoutes);

// サーバーをポート3000で起動
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://52.63.211.146:${port}`);
});
