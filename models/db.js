const mysql=require('mysql2');

const db=mysql.createConnection({
    host:'localhost',
    user:'user01',
    password:'user01',
    database:'mydb'
});

db.connect((err)=>{
    if(err)throw err;
    console.log('Databese Connected');
});

module.exports=db;