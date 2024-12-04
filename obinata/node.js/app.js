const express=require('express');
const app= express();
const session=require('express-session');

//リクエストのボディを処理するのに必要
app.use(express.urlencoded({extended:false}));

//セッション管理のためのミドルウェア登録
app.use(
    session({
        secret:'secret_my',
        resave:false,
        saveUninitialized:false,
    })
);

app.use((req,res,next)=>{
    if (req.session.userId===undefined){
        //res.redirect('/');
        next();
    }else{
        res.locals.username=req.session.username;
        next();
    }
})
//ビューエンジンの設定
app.set('view engine','ejs');

//ルーティングの設定
//第一引数のパスのリクエストは第二引数のルーティング設定に従う
app.use('/',require('./routes/index'));
app.use('/userpage',require('./routes/user'));

app.listen(3000, ()=>{
    console.log('server listening on port 3000');
});