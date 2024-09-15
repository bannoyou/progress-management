const express=require('express');
const router=express.Router();
const db=require('../models/db');

var failed_flag=null;

router.use('/userpage',require('./user'));

router.use('/history',require('./history'));

router.get('/',(req,res)=>res.render('login',{failed:failed_flag}));


router.post('/login',(req,res)=>{
    const {name,pass}=req.body;
    var sql="select id,password from MyGuests where username='"+name+"'";
    db.query(sql,(error,results)=>{
        if (error) throw error;
        if (results.length>0){
            if(pass===results[0].password){
                req.session.userId=results[0].id;
                req.session.username=name;
                failed_flag=false;
                console.log('login success');
                res.redirect('/userpage');
            }else{
                failed_flag=true;
                res.redirect('/');
            }
        }else{
            failed_flag=true;
            res.redirect('/');
        }
    });
});

module.exports=router;