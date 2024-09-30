const express = require('express');
const bodyParser = require('body-parser');
const recordRoutes = require('./routes/record');
const app = express();

// ルート設定
app.get('/', (req, res) => {
    res.render('index'); // 'index.ejs' を views フォルダに配置
  });


// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');

// body-parser設定
app.use(bodyParser.urlencoded({ extended: false }));

//パスの設定
const path=require('path');


// 静的ファイルの提供（必要に応じて設定）
app.use(express.static(path.join(__dirname, 'public')));

// Recordページのルートを設定
app.use('/record', recordRoutes);

// サーバーをポート3000で起動
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
