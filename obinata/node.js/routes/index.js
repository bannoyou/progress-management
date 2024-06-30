const express=require('express');
const router=express.Router();
const db=require('../models/db');

router.get('/',(req,res)=>res.render('login'));


router.post('/login',(req,res)=>{
    const {name,pass}=req.body;
    var sql="select id,password from MyGuests where username='"+name+"'";
    db.query(sql,(error,results)=>{
        if (error) throw error;
        if (results.length>0){
            if(pass===results[0].password){
                req.session.userId=results[0].id;
                req.session.username=name;
                console.log('login success');
                res.redirect('/userpage');
            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/');
        }
    });
});

module.exports=router;